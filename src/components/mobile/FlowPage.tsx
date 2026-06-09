import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** Página de sub-fluxo com header de voltar — padrão das telas transacionais. */
export function FlowPage({
  title,
  subtitle,
  children,
  onBack,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="anim-fadein flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/6 bg-navy-900/80 px-4 py-4 backdrop-blur-xl">
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/6 text-white/80 transition hover:bg-white/12"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-[17px] font-semibold">{title}</h1>
          {subtitle && <p className="text-xs text-white/45">{subtitle}</p>}
        </div>
      </header>
      <div className="flex-1 px-5 py-6">{children}</div>
    </div>
  );
}
