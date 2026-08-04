/**
 * Ré-héberge dans Supabase Storage les affiches d'événements encore stockées
 * sous forme d'URL fbcdn.net.
 *
 * Les URL renvoyées par Apify sont signées et expirent au bout de quelques
 * semaines : passé ce délai l'affiche est perdue définitivement, l'événement
 * Facebook n'étant plus re-scrapé une fois sa date passée. Ce script fait en
 * une passe ce que WF1 fera désormais à chaque scraping
 * (voir docs/n8n-wf1-rehebergement-images.md).
 *
 * Usage :
 *   node scripts/backfill-images.mjs            simulation, n'écrit rien
 *   node scripts/backfill-images.mjs --apply    exécute réellement
 */

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "event-images";
const MAX_OCTETS = 5 * 1024 * 1024;
const TIMEOUT_MS = 20_000;

// Le CDN Facebook renvoie 403 aux requetes non-navigateur.
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Charge .env.local si les variables ne sont pas deja dans l'environnement.
 * Un script node ordinaire ne beneficie pas du chargement automatique de Next.
 */
function chargerEnv() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }
  for (const fichier of [".env.local", ".env"]) {
    if (!existsSync(fichier)) continue;
    for (const ligne of readFileSync(fichier, "utf8").split("\n")) {
      const m = ligne.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const valeur = m[2].replace(/^["']|["']$/g, "").trim();
      if (valeur && !process.env[m[1]]) process.env[m[1]] = valeur;
    }
  }
}

async function telecharger(url) {
  const controleur = new AbortController();
  const minuteur = setTimeout(() => controleur.abort(), TIMEOUT_MS);
  try {
    const reponse = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controleur.signal,
    });
    if (!reponse.ok) return { erreur: `HTTP ${reponse.status}` };

    const mime = (reponse.headers.get("content-type") || "")
      .split(";")[0]
      .trim()
      .toLowerCase();
    const extension = EXTENSIONS[mime];
    if (!extension) return { erreur: `type non supporte: ${mime || "inconnu"}` };

    const octets = Buffer.from(await reponse.arrayBuffer());
    if (octets.length > MAX_OCTETS) {
      return { erreur: `trop lourde: ${(octets.length / 1024 / 1024).toFixed(1)} Mo` };
    }
    if (octets.length === 0) return { erreur: "reponse vide" };

    return { octets, mime, extension };
  } catch (e) {
    return { erreur: e.name === "AbortError" ? "timeout" : e.message };
  } finally {
    clearTimeout(minuteur);
  }
}

async function main() {
  const appliquer = process.argv.includes("--apply");

  chargerEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !cle) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.\n" +
        "Renseignez-les dans .env.local ou dans l'environnement.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, cle, {
    auth: { persistSession: false },
  });

  const { data: evenements, error } = await supabase
    .from("events")
    .select("id, apify_id, titre, image_url")
    .like("image_url", "%fbcdn%");

  if (error) {
    console.error("Lecture impossible:", error.message);
    process.exit(1);
  }

  if (!evenements.length) {
    console.log("Aucune affiche fbcdn a traiter. Rien a faire.");
    return;
  }

  console.log(
    `${evenements.length} affiche(s) fbcdn trouvee(s).` +
      (appliquer ? " Mode reel.\n" : " SIMULATION — aucune ecriture.\n"),
  );

  let reussies = 0;
  const echecs = [];

  for (const ev of evenements) {
    const etiquette = (ev.titre || ev.id).slice(0, 45).padEnd(45);
    const resultat = await telecharger(ev.image_url);

    if (resultat.erreur) {
      echecs.push({ titre: ev.titre, motif: resultat.erreur });
      console.log(`  ECHEC  ${etiquette} ${resultat.erreur}`);
      continue;
    }

    // Le chemin derive de apify_id quand il existe, de l'id sinon : rejouer
    // le script ecrase toujours le meme objet, jamais de doublon dans le bucket.
    const chemin = `apify/${ev.apify_id || ev.id}.${resultat.extension}`;

    if (!appliquer) {
      reussies++;
      console.log(
        `  OK     ${etiquette} ${(resultat.octets.length / 1024).toFixed(0)} Ko -> ${chemin}`,
      );
      continue;
    }

    const { error: erreurUpload } = await supabase.storage
      .from(BUCKET)
      .upload(chemin, resultat.octets, {
        contentType: resultat.mime,
        upsert: true,
      });

    if (erreurUpload) {
      echecs.push({ titre: ev.titre, motif: `upload: ${erreurUpload.message}` });
      console.log(`  ECHEC  ${etiquette} upload: ${erreurUpload.message}`);
      continue;
    }

    const publique = supabase.storage.from(BUCKET).getPublicUrl(chemin)
      .data.publicUrl;

    const { error: erreurUpdate } = await supabase
      .from("events")
      .update({ image_url: publique })
      .eq("id", ev.id);

    if (erreurUpdate) {
      echecs.push({ titre: ev.titre, motif: `update: ${erreurUpdate.message}` });
      console.log(`  ECHEC  ${etiquette} update: ${erreurUpdate.message}`);
      continue;
    }

    reussies++;
    console.log(`  OK     ${etiquette} -> ${chemin}`);
  }

  console.log(
    `\n${reussies} reussie(s), ${echecs.length} echec(s) sur ${evenements.length}.`,
  );

  if (echecs.length) {
    console.log(
      "\nLes affiches en echec sont perdues : leur URL fbcdn a expire.\n" +
        "Les evenements concernes afficheront le degrade de categorie.",
    );
  }

  if (!appliquer && reussies) {
    console.log("\nRelancez avec --apply pour ecrire reellement.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
