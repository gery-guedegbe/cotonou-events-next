/** @type {import('next').NextConfig} */

// Hôte du Storage Supabase, dérivé de l'URL du projet plutôt que codé en dur :
// il change d'un projet à l'autre, et une valeur figée casserait en silence
// l'affichage des affiches après une migration d'environnement.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Seules les images hébergées par la plateforme passent par l'optimiseur.
    // C'est là que le besoin est réel : le formulaire accepte des affiches
    // jusqu'à 5 Mo, servies jusqu'ici en taille d'origine à chaque visiteur.
    // Les affiches Facebook restent en <img> brut : leurs hôtes
    // (scontent-*.fbcdn.net) varient et leurs URL expirent, ce que
    // l'optimiseur transformerait en erreur de rendu au lieu d'un simple
    // repli sur le dégradé de catégorie.
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Le formulaire de soumission accepte des affiches jusqu'à 5 Mo.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

module.exports = nextConfig;
