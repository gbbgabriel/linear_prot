import { useState } from "react";
import { ScanBarcode } from "lucide-react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { SuccessScreen } from "../../../components/mobile/SuccessScreen";
import { Button } from "../../../components/ui/Button";
import { Field, TextInput } from "../../../components/ui/Field";
import { hiperbanco } from "../../../lib/hiperbanco";
import { useBank } from "../../../context/BankContext";
import { brl, dateTimeBR } from "../../../lib/format";

interface Bill { beneficiary: string; amount: number; dueDate: string }

/** Pagamento de Contas — boletos e contas de consumo via linha digitável. */
export function Boleto() {
  const { applyTx } = useBank();
  const [barcode, setBarcode] = useState("");
  const [bill, setBill] = useState<Bill | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function lookup() {
    setLoading(true);
    hiperbanco
      .pagarConta(barcode)
      .then(({ data }) => setBill(data))
      .finally(() => setLoading(false));
  }

  function confirm() {
    setLoading(true);
    setTimeout(() => {
      applyTx({ kind: "boleto", title: "Boleto pago", counterpart: bill!.beneficiary, amount: -bill!.amount });
      setDone(true);
      setLoading(false);
    }, 900);
  }

  if (done && bill) {
    return (
      <SuccessScreen
        title="Pagamento agendado!"
        amount={brl(bill.amount)}
        details={[
          { label: "Beneficiário", value: bill.beneficiary },
          { label: "Vencimento", value: new Date(bill.dueDate).toLocaleDateString("pt-BR") },
          { label: "Data do pagamento", value: dateTimeBR(new Date().toISOString()) },
        ]}
      />
    );
  }

  return (
    <FlowPage title="Pagar conta" subtitle="Boletos e contas de consumo">
      {!bill ? (
        <div className="anim-rise space-y-5">
          <Field label="Linha digitável" hint="Digite ou cole os 47/48 dígitos do código de barras.">
            <TextInput
              autoFocus
              inputMode="numeric"
              placeholder="00000.00000 00000.000000 ..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value.replace(/[^\d.\s]/g, "").slice(0, 60))}
            />
          </Field>
          <Button variant="secondary" className="w-full" onClick={() => setBarcode("82640000001 8 87420138000 6 04268001234 1 56789012345 0")}>
            <ScanBarcode size={18} /> Escanear código de barras
          </Button>
          <Button className="w-full" disabled={barcode.replace(/\D/g, "").length < 20} loading={loading} onClick={lookup}>
            {loading ? "Consultando..." : "Continuar"}
          </Button>
        </div>
      ) : (
        <div className="anim-rise flex h-full flex-col">
          <p className="text-sm text-white/50">Valor do boleto</p>
          <p className="tnum mt-1 font-display text-4xl font-bold">{brl(bill.amount)}</p>
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/4 p-5 text-sm">
            {[
              ["Beneficiário", bill.beneficiary],
              ["Vencimento", new Date(bill.dueDate).toLocaleDateString("pt-BR")],
              ["Multa/juros", "R$ 0,00"],
              ["Tarifa", "Grátis"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <span className="text-white/45">{k}</span>
                <span className="max-w-[60%] text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
          <Button className="mt-auto w-full" loading={loading} onClick={confirm}>
            {loading ? "Pagando..." : "Confirmar pagamento"}
          </Button>
        </div>
      )}
    </FlowPage>
  );
}
