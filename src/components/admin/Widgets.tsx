import type { ElementType } from "react";

/** Widgets do backoffice: cards de métrica e gráficos SVG leves (sem libs). */

export function StatCard({
  icon: Icon, label, value, delta, deltaUp,
}: { icon: ElementType; label: string; value: string; delta?: string; deltaUp?: boolean }) {
  return (
    <div className="rounded-2xl border border-navy-800/8 bg-white p-5 shadow-[0_1px_3px_rgba(6,34,72,0.05)]">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800/6 text-navy-800">
          <Icon size={17} />
        </span>
        {delta && (
          <span className={`text-[12px] font-bold ${deltaUp ? "text-positive" : "text-negative"}`}>
            {deltaUp ? "↑" : "↓"} {delta}
          </span>
        )}
      </div>
      <p className="tnum mt-4 font-display text-[24px] font-bold tracking-tight text-navy-800">{value}</p>
      <p className="mt-0.5 text-[12.5px] text-navy-800/50">{label}</p>
    </div>
  );
}

/** Gráfico de área simples (sparkline preenchida). */
export function AreaChart({
  data, height = 180, stroke = "#E08536",
}: { data: number[]; height?: number; stroke?: string }) {
  const w = 600;
  const max = Math.max(...data) * 1.15;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    height - (v / max) * height,
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`g-${stroke}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${height} L0,${height} Z`} fill={`url(#g-${stroke})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Barras horizontais comparativas (cash-in vs cash-out por trilho). */
export function BarRow({
  label, cashIn, cashOut, max, format,
}: { label: string; cashIn: number; cashOut: number; max: number; format: (v: number) => string }) {
  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="font-semibold text-navy-800">{label}</span>
        <span className="tnum text-navy-800/45">
          <span className="text-positive">{format(cashIn)}</span> · <span className="text-negative">{format(cashOut)}</span>
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-2 overflow-hidden rounded-full bg-navy-800/6">
          <div className="h-full rounded-full bg-positive transition-all duration-700" style={{ width: `${(cashIn / max) * 100}%` }} />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-navy-800/6">
          <div className="h-full rounded-full bg-negative/80 transition-all duration-700" style={{ width: `${(cashOut / max) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Badge de status para tema claro do admin. */
export function LightBadge({ tone, children }: { tone: "success" | "warning" | "danger" | "info" | "neutral"; children: React.ReactNode }) {
  const map = {
    success: "bg-positive/10 text-[#1a8a5c]",
    warning: "bg-brand-500/12 text-brand-700",
    danger: "bg-negative/10 text-negative",
    info: "bg-navy-500/10 text-navy-600",
    neutral: "bg-navy-800/6 text-navy-800/55",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide whitespace-nowrap ${map[tone]}`}>
      {children}
    </span>
  );
}
