import { useState } from "react";
import { Search } from "lucide-react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { SuccessScreen } from "../../../components/mobile/SuccessScreen";
import { AmountInput } from "../../../components/mobile/AmountInput";
import { Button } from "../../../components/ui/Button";
import { Field, TextInput } from "../../../components/ui/Field";
import { hiperbanco } from "../../../lib/hiperbanco";
import { useBank } from "../../../context/BankContext";
import { brl, dateTimeBR } from "../../../lib/format";

type Step = "key" | "amount" | "confirm" | "done";
interface KeyOwner { ownerName: string; ownerDocument: string; bank: string }

/** Pix Cash-out por chave — consulta DICT → valor → confirmação → comprovante. */
export function PixEnviar() {
  const { balance, applyTx } = useBank();
  const [step, setStep] = useState<Step>("key");
  const [key, setKey] = useState("");
  const [owner, setOwner] = useState<KeyOwner | null>(null);
  const [amount, setAmount] = useState(0);
  const [e2eId, setE2eId] = useState("");
  const [loading, setLoading] = useState(false);

  function lookupKey() {
    setLoading(true);
    hiperbanco
      .consultarChavePix(key)
      .then(({ data }) => {
        setOwner(data);
        setStep("amount");
      })
      .finally(() => setLoading(false));
  }

  function send() {
    setLoading(true);
    hiperbanco
      .pixCashOut({ key, amount })
      .then(({ data }) => {
        setE2eId(data.endToEndId);
        applyTx({ kind: "pix_out", title: "Pix enviado", counterpart: owner!.ownerName, amount: -amount });
        setStep("done");
      })
      .finally(() => setLoading(false));
  }

  if (step === "done" && owner) {
    return (
      <SuccessScreen
        title="Pix enviado!"
        amount={brl(amount)}
        details={[
          { label: "Para", value: owner.ownerName },
          { label: "CPF/CNPJ", value: owner.ownerDocument },
          { label: "Instituição", value: owner.bank },
          { label: "Data", value: dateTimeBR(new Date().toISOString()) },
          { label: "ID end-to-end", value: e2eId },
        ]}
      />
    );
  }

  return (
    <FlowPage
      title="Enviar Pix"
      subtitle={step === "key" ? "Para quem você quer transferir?" : owner?.ownerName}
      onBack={step === "amount" ? () => setStep("key") : step === "confirm" ? () => setStep("amount") : undefined}
    >
      {step === "key" && (
        <div className="anim-rise space-y-5">
          <Field label="Chave Pix" hint="CPF, CNPJ, celular, e-mail ou chave aleatória.">
            <TextInput
              autoFocus
              placeholder="Digite ou cole a chave"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </Field>
          <Button className="w-full" disabled={key.length < 5} loading={loading} onClick={lookupKey}>
            <Search size={17} /> {loading ? "Consultando DICT..." : "Buscar chave"}
          </Button>
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-[13px] leading-relaxed text-white/45">
            Contatos recentes aparecem aqui no app final. A consulta usa o endpoint{" "}
            <code className="text-brand-300">GET /v1/pix/keys</code> do Hiperbanco.
          </div>
        </div>
      )}

      {step === "amount" && owner && (
        <div className="anim-rise flex h-full flex-col">
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-700 font-display text-sm font-bold">
              {owner.ownerName.slice(0, 1)}
            </span>
            <div>
              <p className="text-[14px] font-semibold">{owner.ownerName}</p>
              <p className="text-[12px] text-white/45">{owner.bank} · {owner.ownerDocument}</p>
            </div>
          </div>
          <div className="mt-10">
            <AmountInput value={amount} onChange={setAmount} max={balance} />
          </div>
          <Button
            className="mt-auto w-full"
            disabled={amount <= 0 || amount > balance}
            onClick={() => setStep("confirm")}
          >
            Continuar
          </Button>
        </div>
      )}

      {step === "confirm" && owner && (
        <div className="anim-rise flex h-full flex-col">
          <p className="text-sm text-white/50">Você está enviando</p>
          <p className="tnum mt-1 font-display text-4xl font-bold">{brl(amount)}</p>
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/4 p-5 text-sm">
            {[
              ["Para", owner.ownerName],
              ["Documento", owner.ownerDocument],
              ["Instituição", owner.bank],
              ["Chave", key],
              ["Tarifa", "Grátis"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <span className="text-white/45">{k}</span>
                <span className="max-w-[60%] truncate text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
          <Button className="mt-auto w-full" loading={loading} onClick={send}>
            {loading ? "Transferindo..." : "Confirmar Pix"}
          </Button>
        </div>
      )}
    </FlowPage>
  );
}
