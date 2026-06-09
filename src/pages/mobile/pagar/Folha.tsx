import { useState } from "react";
import { Users } from "lucide-react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { SuccessScreen } from "../../../components/mobile/SuccessScreen";
import { Button } from "../../../components/ui/Button";
import { hiperbanco } from "../../../lib/hiperbanco";
import { useBank } from "../../../context/BankContext";
import { brl } from "../../../lib/format";

const EMPLOYEES = [
  { name: "Ana Clara Mendes", role: "Designer", amount: 6800 },
  { name: "Bruno Hoffmann", role: "Dev Sênior", amount: 14200 },
  { name: "Camila Duarte", role: "Financeiro", amount: 7900 },
  { name: "Diego Sanches", role: "Comercial", amount: 9100 },
  { name: "Fernanda Lopes", role: "Operações", amount: 8350 },
];

/** Folha de Pagamento — execução em lote para colaboradores (perfil PJ). */
export function Folha() {
  const { applyTx } = useBank();
  const [selected, setSelected] = useState<Set<number>>(new Set(EMPLOYEES.map((_, i) => i)));
  const [done, setDone] = useState<{ payrollId: string; total: number; employees: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const items = EMPLOYEES.filter((_, i) => selected.has(i));
  const total = items.reduce((s, e) => s + e.amount, 0);

  function submit() {
    setLoading(true);
    hiperbanco
      .folhaDePagamento(items)
      .then(({ data }) => {
        applyTx({ kind: "folha", title: "Folha de pagamento", counterpart: `${data.employees} colaboradores`, amount: -data.total });
        setDone(data);
      })
      .finally(() => setLoading(false));
  }

  if (done) {
    return (
      <SuccessScreen
        title="Folha agendada!"
        amount={brl(done.total)}
        details={[
          { label: "Colaboradores", value: String(done.employees) },
          { label: "Execução", value: "Próximo dia útil · 06h" },
          { label: "ID da folha", value: done.payrollId },
        ]}
      />
    );
  }

  return (
    <FlowPage title="Folha de pagamento" subtitle="Competência Junho/2026">
      <div className="anim-rise flex h-full flex-col">
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
          <Users size={20} className="text-brand-400" />
          <p className="text-[13px] text-white/55">
            <span className="font-semibold text-white">{items.length} de {EMPLOYEES.length}</span> colaboradores selecionados
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {EMPLOYEES.map((e, i) => {
            const on = selected.has(i);
            return (
              <button
                key={e.name}
                onClick={() => {
                  const next = new Set(selected);
                  on ? next.delete(i) : next.add(i);
                  setSelected(next);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  on ? "border-brand-500/35 bg-brand-500/6" : "border-white/8 bg-white/3 opacity-50"
                }`}
              >
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] font-bold ${on ? "border-brand-500 bg-brand-500 text-navy-950" : "border-white/25"}`}>
                  {on ? "✓" : ""}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{e.name}</span>
                  <span className="block text-[12px] text-white/40">{e.role}</span>
                </span>
                <span className="tnum text-[14px] font-semibold">{brl(e.amount)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm text-white/50">Total da folha</span>
            <span className="tnum font-display text-xl font-bold">{brl(total)}</span>
          </div>
          <Button className="w-full" disabled={!items.length} loading={loading} onClick={submit}>
            {loading ? "Agendando folha..." : "Executar folha de pagamento"}
          </Button>
        </div>
      </div>
    </FlowPage>
  );
}
