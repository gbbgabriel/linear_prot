import { useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";
import { Button } from "../ui/Button";

/** Comprovante de sucesso com check animado — fecho padrão de todo fluxo transacional. */
export function SuccessScreen({
  title,
  amount,
  details,
  doneTo = "/app",
}: {
  title: string;
  amount?: string;
  details: { label: string; value: string }[];
  doneTo?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="anim-fadein flex min-h-dvh flex-col items-center px-6 pt-20">
      <div className="anim-pop grid h-24 w-24 place-items-center rounded-full bg-positive/12 ring-1 ring-positive/30">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path
            d="M10 23.5 18.5 32 34 13"
            stroke="var(--color-positive)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40"
            strokeDashoffset="40"
            style={{ animation: "draw-check 0.5s 0.35s ease-out forwards" }}
          />
        </svg>
      </div>

      <h1 className="anim-rise d-2 mt-6 text-center font-display text-xl font-semibold">{title}</h1>
      {amount && (
        <p className="anim-rise d-3 tnum mt-2 font-display text-3xl font-bold text-positive">
          {amount}
        </p>
      )}

      <div className="anim-rise d-4 mt-8 w-full rounded-2xl border border-white/8 bg-white/4 p-5">
        {details.map((d) => (
          <div key={d.label} className="flex items-start justify-between gap-4 py-2 text-sm">
            <span className="text-white/45">{d.label}</span>
            <span className="tnum max-w-[60%] text-right font-medium break-all">{d.value}</span>
          </div>
        ))}
      </div>

      <div className="anim-rise d-5 mt-auto mb-8 flex w-full gap-3 pt-8">
        <Button variant="secondary" className="flex-1">
          <Share2 size={17} /> Comprovante
        </Button>
        <Button className="flex-1" onClick={() => navigate(doneTo)}>
          Concluir
        </Button>
      </div>
    </div>
  );
}
