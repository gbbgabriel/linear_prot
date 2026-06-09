import { useState } from "react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { SuccessScreen } from "../../../components/mobile/SuccessScreen";
import { Button } from "../../../components/ui/Button";
import { Field, TextInput, Select } from "../../../components/ui/Field";
import { hiperbanco } from "../../../lib/hiperbanco";
import { useBank } from "../../../context/BankContext";
import { brl, maskPhone } from "../../../lib/format";

const VALUES = [15, 20, 30, 50, 100];

/** Recargas de celular e serviços (endpoint /v1/topups). */
export function Recarga() {
  const { applyTx } = useBank();
  const [carrier, setCarrier] = useState("Vivo");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(30);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit() {
    setLoading(true);
    hiperbanco
      .recarga({ carrier, phone, amount })
      .then(() => {
        applyTx({ kind: "recarga", title: "Recarga de celular", counterpart: `${carrier} · ${phone}`, amount: -amount });
        setDone(true);
      })
      .finally(() => setLoading(false));
  }

  if (done) {
    return (
      <SuccessScreen
        title="Recarga concluída!"
        amount={brl(amount)}
        details={[
          { label: "Operadora", value: carrier },
          { label: "Número", value: phone },
          { label: "Crédito", value: "Disponível imediatamente" },
        ]}
      />
    );
  }

  return (
    <FlowPage title="Recarga" subtitle="Celular, transporte e serviços">
      <div className="anim-rise flex h-full flex-col space-y-5">
        <Field label="Operadora">
          <Select value={carrier} onChange={(e) => setCarrier(e.target.value)}>
            {["Vivo", "Claro", "TIM", "Oi", "Bilhete Único", "Uber Créditos", "Google Play", "Steam"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Número do celular">
          <TextInput inputMode="numeric" placeholder="(11) 90000-0000" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} />
        </Field>
        <div>
          <p className="mb-2 text-[13px] font-medium text-white/55">Valor da recarga</p>
          <div className="grid grid-cols-5 gap-2">
            {VALUES.map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className={`tnum rounded-xl border py-3 text-[14px] font-bold transition ${
                  amount === v
                    ? "border-brand-500 bg-brand-500/15 text-brand-400"
                    : "border-white/10 bg-white/4 text-white/60"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="!mt-auto pt-6">
          <Button className="w-full" disabled={phone.length < 14} loading={loading} onClick={submit}>
            {loading ? "Recarregando..." : `Recarregar ${brl(amount)}`}
          </Button>
        </div>
      </div>
    </FlowPage>
  );
}
