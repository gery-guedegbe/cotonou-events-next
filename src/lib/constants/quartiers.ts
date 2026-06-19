export const QUARTIERS = [
  "Haie-Vive",
  "Cadjèhoun",
  "Akpakpa",
  "Fidjrossè",
  "Centre-ville",
  "Dantokpa",
  "Gbèdjromèdji",
  "Agla",
  "Zogbo",
  "Autre",
] as const;

export type Quartier = (typeof QUARTIERS)[number];
