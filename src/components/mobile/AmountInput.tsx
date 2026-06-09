import { brl } from "../../lib/format";

/** Input de valor monetário em destaque (estilo "digite o valor" dos bancos digitais). */
export function AmountInput({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1 font-display">
          <span className="text-lg text-white/40">R$</span>
          <span className={`tnum text-[40px] font-bold ${value ? "text-white" : "text-white/25"}`}>
            {value
              ? value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
              : "0,00"}
          </span>
        </span>
        <input
          inputMode="numeric"
          autoFocus
          aria-label="Valor"
          className="h-20 w-full bg-transparent text-transparent caret-transparent outline-none"
          value=""
          onKeyDown={(e) => {
            const cents = Math.round(value * 100);
            if (e.key === "Backspace") {
              onChange(Math.floor(cents / 10) / 100);
            } else if (/^\d$/.test(e.key)) {
              const next = cents * 10 + Number(e.key);
              if (next < 1e11) onChange(next / 100);
            }
          }}
        />
      </div>
      {max !== undefined && (
        <p className={`text-center text-xs ${value > max ? "text-negative" : "text-white/40"}`}>
          {value > max ? "Saldo insuficiente · " : ""}Saldo disponível: <span className="tnum">{brl(max)}</span>
        </p>
      )}
    </div>
  );
}
