export interface LegalDoc {
  title: string;
  intro: string;
  sections: { h: string; body: string }[];
}

export const LEGAL_DOCS = {
  "politique-de-confidentialite": {
    title: "Politique de confidentialité",
    intro:
      "Cotonou.events s'engage à protéger vos données personnelles. Cette politique décrit les informations que nous collectons et l'usage que nous en faisons.",
    sections: [
      {
        h: "Données collectées",
        body: "Nous collectons uniquement votre prénom, votre numéro WhatsApp et vos catégories d'événements favorites. Aucune autre donnée personnelle n'est demandée pour vous abonner aux alertes.",
      },
      {
        h: "Usage des données",
        body: "Vos données servent exclusivement à l'envoi du digest hebdomadaire d'événements le vendredi. Elles ne sont jamais vendues, louées ni partagées avec des tiers à des fins commerciales.",
      },
      {
        h: "Durée de conservation",
        body: "Vos données sont conservées tant que vous êtes abonné. Dès réception du mot « STOP », votre numéro est définitivement supprimé de nos listes sous 48h.",
      },
      {
        h: "Vos droits",
        body: "Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour l'exercer, contactez-nous ou répondez directement sur WhatsApp.",
      },
      {
        h: "Nous contacter à propos de vos données",
        body: "Pour toute question relative à vos données, écrivez à privacy@cotonou.events.",
      },
      {
        h: "Cookies",
        body: "Le site n'utilise que des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de traçage tiers n'est déposé.",
      },
    ],
  },
  "conditions-utilisation": {
    title: "Conditions d'utilisation",
    intro:
      "En utilisant Cotonou.events, vous acceptez les présentes conditions.",
    sections: [
      {
        h: "Objet du service",
        body: "Cotonou.events est un service gratuit de découverte d'événements à Cotonou et d'envoi d'alertes hebdomadaires via WhatsApp.",
      },
      {
        h: "Utilisation acceptable",
        body: "Vous vous engagez à utiliser le service de bonne foi. Toute tentative de spam, de fraude ou d'usage abusif entraîne une exclusion immédiate.",
      },
      {
        h: "Soumission d'événements",
        body: "Les événements soumis doivent être réels, publics et se dérouler à Cotonou. Ils sont mis en ligne dès l'envoi du formulaire. Nous retirons sans préavis toute soumission fausse ou trompeuse, et pouvons bloquer son auteur.",
      },
      {
        h: "Responsabilités",
        body: "Cotonou.events agit comme un agrégateur. Nous ne sommes pas responsables de l'organisation des événements listés, de leur annulation ou de leur contenu.",
      },
      {
        h: "Modification des conditions",
        body: "Ces conditions peuvent évoluer. Les utilisateurs abonnés sont informés de tout changement majeur via WhatsApp.",
      },
    ],
  },
  "mentions-legales": {
    title: "Mentions légales",
    intro: "Informations légales relatives au site Cotonou.events.",
    sections: [
      {
        h: "Éditeur",
        body: "Cotonou.events — projet indépendant basé à Cotonou, Bénin. Contact : contact@cotonou.events",
      },
      {
        h: "Hébergeur",
        body: "Le site est hébergé par un prestataire cloud conforme au RGPD. Les bases de données sont opérées via Supabase.",
      },
      {
        h: "Propriété intellectuelle",
        body: "La marque, le logo et le design de Cotonou.events sont protégés. Les visuels des événements appartiennent à leurs organisateurs respectifs.",
      },
      {
        h: "Contact",
        body: "Pour toute demande légale : legal@cotonou.events",
      },
    ],
  },
  "a-propos": {
    title: "À propos",
    intro:
      "Cotonou.events est né d'un constat simple : il est difficile de savoir ce qui se passe en ville.",
    sections: [
      {
        h: "Le problème",
        body: "Les événements de Cotonou sont éparpillés entre des dizaines de pages Facebook, des affiches dans la rue et le bouche-à-oreille. On rate les meilleurs plans parce qu'on n'était pas au courant.",
      },
      {
        h: "Notre solution",
        body: "Un seul message WhatsApp chaque vendredi à 18h, avec les 7 meilleurs événements du week-end. Rien à installer, aucun compte à créer.",
      },
      {
        h: "Qui est derrière",
        body: "Un projet indépendant monté à Cotonou par une seule personne, qui en avait assez de rater les bons plans faute d'être au courant.",
      },
      {
        h: "Contact",
        body: "Écrivez à contact@cotonou.events. Les retours sur un événement inexact sont particulièrement utiles.",
      },
    ],
  },
  cookies: {
    title: "Gestion des cookies",
    intro: "Ce site dépose le strict minimum : aucun cookie publicitaire, aucun traceur tiers.",
    sections: [
      {
        h: "Cookies essentiels",
        body: "Seuls les cookies nécessaires au fonctionnement du site (préférences d'affichage, session) sont utilisés. Ils ne nécessitent pas de consentement mais sont décrits ici par transparence.",
      },
      {
        h: "Pas de traçage",
        body: "Aucun traceur publicitaire ni pixel de réseau social n'est déposé sur votre appareil.",
      },
      {
        h: "Gérer vos préférences",
        body: "Vous pouvez à tout moment effacer les cookies depuis les réglages de votre navigateur. Le site continuera de fonctionner normalement.",
      },
    ],
  },
  contact: {
    title: "Contact",
    intro:
      "Voici comment joindre le projet, selon ce que vous cherchez.",
    sections: [
      {
        h: "Par email",
        body: "Écrivez-nous à contact@cotonou.events. Nous répondons généralement sous 48h.",
      },
      {
        h: "Par WhatsApp",
        body: "Si vous êtes abonné aux alertes, répondez simplement à notre numéro WhatsApp.",
      },
      {
        h: "Pour les organisateurs",
        body: "Soumettez votre événement directement depuis la page « Soumettre un événement ».",
      },
    ],
  },
  signaler: {
    title: "Signaler un problème",
    intro:
      "Les événements sont publiés automatiquement, donc des erreurs passent. Les signaler est le moyen le plus direct de garder le catalogue fiable.",
    sections: [
      {
        h: "Événement incorrect",
        body: "Si les informations d'un événement sont erronées ou si l'événement a été annulé, signalez-le à report@cotonou.events en précisant le titre.",
      },
      {
        h: "Problème technique",
        body: "Décrivez le problème rencontré (page, navigateur, appareil) à contact@cotonou.events.",
      },
      {
        h: "Contenu inapproprié",
        body: "Tout contenu trompeur ou inapproprié est traité en priorité et retiré après vérification.",
      },
    ],
  },
} satisfies Record<string, LegalDoc>;

export type LegalSlug = keyof typeof LEGAL_DOCS;
