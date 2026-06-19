import { SUBSCRIBER_TREND } from "@/lib/data/admin";

/** Graphique d'aire simple (line + area) des abonnés sur 30 jours. */
export function SubscribersChart() {
  const W = 600;
  const H = 170;
  const pad = 8;
  const min = 40;
  const max = 130;
  const pts = SUBSCRIBER_TREND;
  const step = (W - pad * 2) / (pts.length - 1);
  const xy = pts.map(
    (v, i) =>
      [
        pad + i * step,
        H - pad - ((v - min) / (max - min)) * (H - pad * 2),
      ] as const,
  );
  const line = xy
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${xy[xy.length - 1][0].toFixed(1)} ${H - pad} L${xy[0][0].toFixed(1)} ${H - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="subTrend" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#subTrend)" />

      <path
        d={line}
        fill="none"
        stroke="#16A34A"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
