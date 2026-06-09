import { useState } from "react";
import { Eye, Lock, LockOpen, Plus, Settings2, Smartphone, Truck } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { Logo } from "../../components/ui/Logo";
import { hiperbanco } from "../../lib/hiperbanco";
import { useBank, type Card } from "../../context/BankContext";

/** Emissão e gestão de cartões Virtual e Físico. */
export function Cartoes() {
  const { cards, addCard, toggleCardBlock, user } = useBank();
  const [active, setActive] = useState(0);
  const [emitting, setEmitting] = useState<"VIRTUAL" | "PHYSICAL" | null>(null);

  const card = cards[active];

  function emit(type: "VIRTUAL" | "PHYSICAL") {
    setEmitting(type);
    hiperbanco
      .emitirCartao({ type, printedName: user.name.toUpperCase() })
      .then(({ data }) => {
        addCard({
          id: data.cardId,
          type,
          last4: data.last4,
          printedName: data.printedName,
          status: data.status as Card["status"],
        });
        setActive(0);
      })
      .finally(() => setEmitting(null));
  }

  return (
    <div className="anim-fadein px-5 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Cartões</h1>
          <p className="mt-1 text-sm text-white/50">Mastercard internacional, sem anuidade.</p>
        </div>
      </div>

      {/* Carrossel de cartões */}
      <div className="anim-rise d-1 -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => setActive(i)} className="snap-center shrink-0">
            <CardVisual card={c} dimmed={i !== active} />
          </button>
        ))}
      </div>

      {/* Ações do cartão selecionado */}
      {card && (
        <div className="anim-rise d-2 mt-5">
          <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3.5">
            <div>
              <p className="text-[14px] font-semibold">
                {card.type === "VIRTUAL" ? "Cartão virtual" : "Cartão físico"} ·· {card.last4}
              </p>
              <p className="text-[12px] text-white/40">Função crédito e débito</p>
            </div>
            <StatusBadge status={card.status} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <CardAction icon={Eye} label="Ver dados" />
            <CardAction
              icon={card.status === "BLOCKED" ? LockOpen : Lock}
              label={card.status === "BLOCKED" ? "Desbloquear" : "Bloquear"}
              onClick={() => toggleCardBlock(card.id)}
              warn={card.status !== "BLOCKED"}
            />
            <CardAction icon={Settings2} label="Limites" />
          </div>

          {card.status === "PRODUCTION" && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-navy-500/30 bg-navy-500/10 p-4 text-[13px] text-white/65">
              <Truck size={18} className="shrink-0 text-navy-100" />
              Cartão em produção — previsão de entrega: <strong className="text-white">7 dias úteis</strong>.
            </div>
          )}
        </div>
      )}

      {/* Emissão */}
      <h2 className="anim-rise d-3 mt-8 font-display text-[15px] font-semibold text-white/85">Emitir novo cartão</h2>
      <div className="anim-rise d-4 mt-3 grid grid-cols-2 gap-3 pb-4">
        <Button
          variant="secondary"
          className="h-auto flex-col items-start gap-2 p-4"
          loading={emitting === "VIRTUAL"}
          onClick={() => emit("VIRTUAL")}
        >
          <Smartphone size={20} className="text-brand-400" />
          <span className="text-left text-[13px] leading-snug">
            Virtual<br /><span className="font-sans text-[11px] font-normal text-white/45">Pronto na hora</span>
          </span>
        </Button>
        <Button
          variant="secondary"
          className="h-auto flex-col items-start gap-2 p-4"
          loading={emitting === "PHYSICAL"}
          onClick={() => emit("PHYSICAL")}
        >
          <Plus size={20} className="text-brand-400" />
          <span className="text-left text-[13px] leading-snug">
            Físico<br /><span className="font-sans text-[11px] font-normal text-white/45">Entrega em 7 dias</span>
          </span>
        </Button>
      </div>
    </div>
  );
}

function CardVisual({ card, dimmed }: { card: Card; dimmed?: boolean }) {
  return (
    <div
      className={`relative h-[190px] w-[310px] overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 ${
        dimmed ? "scale-[0.96] opacity-50" : "shadow-[0_24px_50px_-18px_rgba(6,34,72,0.9)]"
      } ${
        card.type === "VIRTUAL"
          ? "bg-gradient-to-br from-brand-500 via-brand-600 to-navy-800"
          : "bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950"
      }`}
    >
      <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="flex items-start justify-between">
        <Logo size={11} />
        <span className="rounded-md bg-black/25 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] text-white/80">
          {card.type === "VIRTUAL" ? "VIRTUAL" : "FÍSICO"}
        </span>
      </div>
      {/* Chip */}
      <div className="mt-5 h-7 w-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-90" />
      <p className="tnum mt-3 font-mono text-[15px] tracking-[0.18em] text-white/90">
        •••• •••• •••• {card.last4}
      </p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-[10px] font-semibold tracking-wider text-white/70">{card.printedName}</p>
        {/* Mastercard */}
        <span className="flex">
          <span className="h-6 w-6 rounded-full bg-[#EB001B]/90" />
          <span className="-ml-2.5 h-6 w-6 rounded-full bg-[#F79E1B]/90 mix-blend-screen" />
        </span>
      </div>
    </div>
  );
}

function CardAction({
  icon: Icon, label, onClick, warn,
}: { icon: React.ElementType; label: string; onClick?: () => void; warn?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/4 py-4 text-[12px] font-medium transition hover:bg-white/8 ${
        warn ? "text-white/75" : "text-white/75"
      }`}
    >
      <Icon size={19} className="text-brand-400" />
      {label}
    </button>
  );
}
