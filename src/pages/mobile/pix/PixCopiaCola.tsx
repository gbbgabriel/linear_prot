import { useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { SuccessScreen } from "../../../components/mobile/SuccessScreen";
import { Button } from "../../../components/ui/Button";
import { Field } from "../../../components/ui/Field";
import { hiperbanco } from "../../../lib/hiperbanco";
import { useBank } from "../../../context/BankContext";
import { brl, dateTimeBR } from "../../../lib/format";

interface Decoded { receiverName: string; receiverDocument: string; amount: number; description: string }

/** Pix Copia e Cola — decodifica o EMV da cobrança e liquida o cash-out. */
export function PixCopiaCola() {
  const { applyTx } = useBank();
  const [emv, setEmv] = useState("");
  const [decoded, setDecoded] = useState<Decoded | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function decode() {
    setLoading(true);
    hiperbanco
      .decodificarCopiaECola(emv)
      .then(({ data }) => setDecoded(data))
      .finally(() => setLoading(false));
  }

  function pay() {
    setLoading(true);
    hiperbanco
      .pixCashOut({ key: "emv", amount: decoded!.amount })
      .then(() => {
        applyTx({ kind: "pix_out", title: "Pix Copia e Cola", counterpart: decoded!.receiverName, amount: -decoded!.amount });
        setDone(true);
      })
      .finally(() => setLoading(false));
  }

  if (done && decoded) {
    return (
      <SuccessScreen
        title="Cobrança paga!"
        amount={brl(decoded.amount)}
        details={[
          { label: "Beneficiário", value: decoded.receiverName },
          { label: "CNPJ", value: decoded.receiverDocument },
          { label: "Descrição", value: decoded.description },
          { label: "Data", value: dateTimeBR(new Date().toISOString()) },
        ]}
      />
    );
  }

  return (
    <FlowPage title="Pix Copia e Cola" subtitle="Cole o código da cobrança">
      {!decoded ? (
        <div className="anim-rise space-y-5">
          <Field label="Código Pix (EMV)">
            <textarea
              autoFocus
              rows={5}
              placeholder="00020126580014br.gov.bcb.pix..."
              value={emv}
              onChange={(e) => setEmv(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/6 p-4 font-mono text-[13px] text-white placeholder:text-white/25 outline-none focus:border-brand-500/70"
            />
          </Field>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setEmv("00020126580014br.gov.bcb.pix0136demo-eletropaulo-fatura-jun-20265204000053039865406234.185802BR5920ELETROPAULO DIST SA")}
          >
            <ClipboardPaste size={17} /> Colar da área de transferência
          </Button>
          <Button className="w-full" disabled={emv.length < 30} loading={loading} onClick={decode}>
            {loading ? "Decodificando..." : "Continuar"}
          </Button>
        </div>
      ) : (
        <div className="anim-rise flex h-full flex-col">
          <p className="text-sm text-white/50">Você está pagando</p>
          <p className="tnum mt-1 font-display text-4xl font-bold">{brl(decoded.amount)}</p>
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/4 p-5 text-sm">
            {[
              ["Beneficiário", decoded.receiverName],
              ["CNPJ", decoded.receiverDocument],
              ["Descrição", decoded.description],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <span className="text-white/45">{k}</span>
                <span className="max-w-[60%] text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
          <Button className="mt-auto w-full" loading={loading} onClick={pay}>
            {loading ? "Pagando..." : "Confirmar pagamento"}
          </Button>
        </div>
      )}
    </FlowPage>
  );
}
