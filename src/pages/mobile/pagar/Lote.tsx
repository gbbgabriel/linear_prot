import { useState } from "react";
import { FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { SuccessScreen } from "../../../components/mobile/SuccessScreen";
import { Button } from "../../../components/ui/Button";
import { hiperbanco } from "../../../lib/hiperbanco";
import { useBank } from "../../../context/BankContext";
import { brl } from "../../../lib/format";

/** Pagamento em Lote — múltiplos boletos numa única requisição (perfil PJ). */
export function Lote() {
  const { applyTx } = useBank();
  const [items, setItems] = useState([
    { beneficiary: "Atlas Embalagens LTDA", amount: 7420.0 },
    { beneficiary: "Transportadora Rumo Certo", amount: 3180.5 },
    { beneficiary: "Locação Galpão — Jun/2026", amount: 12500.0 },
  ]);
  const [done, setDone] = useState<{ batchId: string; count: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((s, i) => s + i.amount, 0);

  function submit() {
    setLoading(true);
    hiperbanco
      .pagamentoEmLote(items)
      .then(({ data }) => {
        applyTx({ kind: "boleto", title: "Pagamento em lote", counterpart: `${data.count} boletos`, amount: -data.total });
        setDone(data);
      })
      .finally(() => setLoading(false));
  }

  if (done) {
    return (
      <SuccessScreen
        title="Lote enviado para processamento!"
        amount={brl(done.total)}
        details={[
          { label: "Boletos no lote", value: String(done.count) },
          { label: "ID do lote", value: done.batchId },
          { label: "Status", value: "PROCESSING" },
        ]}
      />
    );
  }

  return (
    <FlowPage title="Pagamento em lote" subtitle="Pague vários boletos de uma vez">
      <div className="anim-rise flex h-full flex-col">
        <Button variant="secondary" className="w-full">
          <FileSpreadsheet size={18} /> Importar CSV / CNAB
        </Button>

        <div className="mt-5 space-y-2.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">{item.beneficiary}</p>
                <p className="text-[12px] text-white/40">Boleto · vence 15/06/2026</p>
              </div>
              <p className="tnum text-[14px] font-semibold">{brl(item.amount)}</p>
              <button
                onClick={() => setItems(items.filter((_, j) => j !== i))}
                className="text-white/30 transition hover:text-negative"
                aria-label="Remover"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setItems([...items, { beneficiary: `Fornecedor ${items.length + 1}`, amount: 990 }])}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 py-3.5 text-[13px] font-semibold text-white/50 transition hover:border-brand-500/40 hover:text-brand-400"
        >
          <Plus size={16} /> Adicionar boleto
        </button>

        <div className="mt-auto pt-6">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm text-white/50">Total do lote ({items.length})</span>
            <span className="tnum font-display text-xl font-bold">{brl(total)}</span>
          </div>
          <Button className="w-full" disabled={!items.length} loading={loading} onClick={submit}>
            {loading ? "Enviando lote..." : "Autorizar pagamento em lote"}
          </Button>
        </div>
      </div>
    </FlowPage>
  );
}
