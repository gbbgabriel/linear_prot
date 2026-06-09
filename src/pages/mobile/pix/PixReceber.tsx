import { useMemo, useState } from "react";
import { Copy, Check, QrCode } from "lucide-react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { AmountInput } from "../../../components/mobile/AmountInput";
import { Button } from "../../../components/ui/Button";
import { hiperbanco } from "../../../lib/hiperbanco";
import { brl } from "../../../lib/format";

/** Pix Cash-in — gera QR Code de cobrança (com ou sem valor definido). */
export function PixReceber() {
  const [amount, setAmount] = useState(0);
  const [emv, setEmv] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function generate() {
    setLoading(true);
    hiperbanco
      .pixGerarQrCode({ amount: amount || undefined })
      .then(({ data }) => setEmv(data.emv))
      .finally(() => setLoading(false));
  }

  return (
    <FlowPage title="Receber Pix" subtitle="Gere um QR Code de cobrança">
      {!emv ? (
        <div className="anim-rise flex h-full flex-col">
          <p className="text-center text-sm text-white/50">Qual valor você quer cobrar?</p>
          <div className="mt-6">
            <AmountInput value={amount} onChange={setAmount} />
          </div>
          <p className="mt-2 text-center text-xs text-white/35">
            Deixe R$ 0,00 para o pagador escolher o valor.
          </p>
          <Button className="mt-auto w-full" loading={loading} onClick={generate}>
            <QrCode size={18} /> {loading ? "Gerando cobrança..." : "Gerar QR Code"}
          </Button>
        </div>
      ) : (
        <div className="anim-rise flex flex-col items-center">
          <div className="anim-pop rounded-3xl bg-white p-5 shadow-[0_20px_60px_-20px_rgba(255,255,255,0.25)]">
            <FakeQr seed={emv} />
          </div>
          {amount > 0 && (
            <p className="tnum mt-5 font-display text-2xl font-bold">{brl(amount)}</p>
          )}
          <p className="mt-1 text-[13px] text-white/45">Linear Banco Digital · expira em 24h</p>

          <div className="mt-6 w-full rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-[11px] font-semibold tracking-wider text-white/40">PIX COPIA E COLA</p>
            <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-white/65">
              {emv.slice(0, 90)}…
            </p>
          </div>
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => {
              navigator.clipboard?.writeText(emv);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? <Check size={17} className="text-positive" /> : <Copy size={17} />}
            {copied ? "Copiado!" : "Copiar código"}
          </Button>
        </div>
      )}
    </FlowPage>
  );
}

/** QR estilizado determinístico (placeholder visual do EMV real). */
function FakeQr({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const out: boolean[] = [];
    for (let i = 0; i < 441; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      out.push((h >> 16) % 3 !== 0);
    }
    return out;
  }, [seed]);

  return (
    <svg width="210" height="210" viewBox="0 0 21 21" shapeRendering="crispEdges">
      {cells.map((on, i) => {
        const x = i % 21;
        const y = Math.floor(i / 21);
        const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        if (corner) return null;
        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#062248" /> : null;
      })}
      {/* Olhos de posicionamento */}
      {[[0, 0], [14, 0], [0, 14]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#062248" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#E08536" />
        </g>
      ))}
    </svg>
  );
}
