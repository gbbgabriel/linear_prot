import { useState } from "react";
import { Check, FileSignature, TrendingUp, Wallet } from "lucide-react";
import { LightBadge, StatCard } from "../../components/admin/Widgets";
import { brl } from "../../lib/format";

/** Módulo de Crédito — esteira de aprovação e tracking das CCBs emitidas no app. */

type CcbStatus = "ANALYSIS" | "AWAITING_SIGNATURE" | "ACTIVE" | "SETTLED" | "OVERDUE";

interface CcbRow {
  number: string;
  client: string;
  amount: number;
  installments: number;
  rate: string;
  issuedAt: string;
  status: CcbStatus;
}

const seed: CcbRow[] = [
  { number: "CCB-2026-31501", client: "Renata Borges Lima", amount: 24000, installments: 36, rate: "2,19%", issuedAt: "09/06/2026", status: "ANALYSIS" },
  { number: "CCB-2026-31482", client: "Marcos Vinícius Teles", amount: 32000, installments: 36, rate: "2,34%", issuedAt: "09/06/2026", status: "ANALYSIS" },
  { number: "CCB-2026-31477", client: "Marcos Andrade Silveira", amount: 20000, installments: 24, rate: "2,19%", issuedAt: "09/06/2026", status: "AWAITING_SIGNATURE" },
  { number: "CCB-2026-31390", client: "Hexa Log LTDA", amount: 120000, installments: 48, rate: "1,98%", issuedAt: "07/06/2026", status: "ACTIVE" },
  { number: "CCB-2026-31288", client: "Paula Andrade Souto", amount: 8500, installments: 12, rate: "2,55%", issuedAt: "04/06/2026", status: "ACTIVE" },
  { number: "CCB-2026-30911", client: "Delta Foods ME", amount: 45000, installments: 36, rate: "2,10%", issuedAt: "28/05/2026", status: "OVERDUE" },
  { number: "CCB-2026-29804", client: "Tiago Munhoz Prado", amount: 15000, installments: 24, rate: "2,19%", issuedAt: "12/05/2026", status: "SETTLED" },
];

const cfg: Record<CcbStatus, { label: string; tone: "warning" | "success" | "danger" | "info" | "neutral" }> = {
  ANALYSIS: { label: "Em análise", tone: "warning" },
  AWAITING_SIGNATURE: { label: "Aguard. assinatura", tone: "info" },
  ACTIVE: { label: "Ativa", tone: "success" },
  SETTLED: { label: "Liquidada", tone: "neutral" },
  OVERDUE: { label: "Em atraso", tone: "danger" },
};

export function AdminCredito() {
  const [rows, setRows] = useState(seed);

  const approve = (number: string) =>
    setRows((rs) => rs.map((r) => (r.number === number ? { ...r, status: "AWAITING_SIGNATURE" as const } : r)));

  const carteira = rows.filter((r) => r.status === "ACTIVE" || r.status === "OVERDUE").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="anim-fadein">
      <h1 className="font-display text-2xl font-bold text-navy-800">Crédito · CCB</h1>
      <p className="mt-1 text-[13.5px] text-navy-800/50">
        Esteira de emissão via <code className="rounded bg-navy-800/6 px-1.5 py-0.5 text-[12px] text-brand-700">POST /v1/ccb</code> · setup Credit-as-a-Service Hiperbanco
      </p>

      <div className="anim-rise d-1 mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Carteira ativa" value={brl(carteira)} delta="6,1% no mês" deltaUp />
        <StatCard icon={FileSignature} label="Aguardando análise" value={String(rows.filter((r) => r.status === "ANALYSIS").length)} />
        <StatCard icon={TrendingUp} label="Taxa média" value="2,21% a.m." />
        <StatCard icon={Wallet} label="Inadimplência (90d)" value="1,8%" delta="0,3 p.p." deltaUp={false} />
      </div>

      <div className="anim-rise d-2 mt-6 overflow-hidden rounded-2xl border border-navy-800/8 bg-white">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-navy-800/8 bg-navy-800/3 text-[11.5px] uppercase tracking-wider text-navy-800/45">
              <th className="px-5 py-3.5 font-semibold">Cédula</th>
              <th className="px-5 py-3.5 font-semibold">Tomador</th>
              <th className="px-5 py-3.5 text-right font-semibold">Principal</th>
              <th className="px-5 py-3.5 font-semibold">Prazo</th>
              <th className="px-5 py-3.5 font-semibold">Taxa</th>
              <th className="px-5 py-3.5 font-semibold">Emissão</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 text-right font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.number} className="border-b border-navy-800/5 transition last:border-0 hover:bg-navy-800/2">
                <td className="px-5 py-4 font-mono text-[12.5px] font-semibold text-navy-600">{r.number}</td>
                <td className="px-5 py-4 font-semibold text-navy-800">{r.client}</td>
                <td className="tnum px-5 py-4 text-right font-semibold text-navy-800">{brl(r.amount)}</td>
                <td className="tnum px-5 py-4 text-navy-800/65">{r.installments}x</td>
                <td className="tnum px-5 py-4 text-navy-800/65">{r.rate} a.m.</td>
                <td className="tnum px-5 py-4 text-navy-800/55">{r.issuedAt}</td>
                <td className="px-5 py-4">
                  <LightBadge tone={cfg[r.status].tone}>{cfg[r.status].label}</LightBadge>
                </td>
                <td className="px-5 py-4 text-right">
                  {r.status === "ANALYSIS" ? (
                    <button
                      onClick={() => approve(r.number)}
                      className="inline-flex items-center gap-1 rounded-lg bg-navy-800 px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-navy-700"
                    >
                      <Check size={13} /> Aprovar emissão
                    </button>
                  ) : (
                    <span className="text-[12px] text-navy-800/30">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
