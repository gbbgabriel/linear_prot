import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FlowPage } from "../../components/mobile/FlowPage";
import { SuccessScreen } from "../../components/mobile/SuccessScreen";
import { AmountInput } from "../../components/mobile/AmountInput";
import { Button } from "../../components/ui/Button";
import { Field, TextInput, Select } from "../../components/ui/Field";
import { hiperbanco } from "../../lib/hiperbanco";
import { useBank } from "../../context/BankContext";
import { brl, dateTimeBR, maskCpf } from "../../lib/format";

/** TED Cash-out e P2P (transferência entre contas Linear) num único fluxo com abas. */
export function Transferir() {
  const [params] = useSearchParams();
  const { balance, applyTx } = useBank();
  const [tab, setTab] = useState<"ted" | "p2p">(params.get("tab") === "p2p" ? "p2p" : "ted");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ id: string; eta?: string } | null>(null);

  const [ted, setTed] = useState({ bankCode: "341", branch: "", account: "", document: "", name: "" });
  const [p2pAccount, setP2pAccount] = useState("");

  const formOk =
    tab === "ted"
      ? ted.branch.length >= 3 && ted.account.length >= 5 && ted.name.length > 4 && ted.document.length === 14
      : p2pAccount.length >= 6;

  function send() {
    setLoading(true);
    const call =
      tab === "ted"
        ? hiperbanco.tedCashOut({ ...ted, amount }).then(({ data }) => {
            applyTx({ kind: "ted_out", title: "TED enviada", counterpart: ted.name, amount: -amount });
            setDone({ id: data.transactionId, eta: data.eta });
          })
        : hiperbanco.p2pTransfer({ account: p2pAccount, amount }).then(({ data }) => {
            applyTx({ kind: "p2p_out", title: "P2P enviado", counterpart: `Conta Linear ${p2pAccount}`, amount: -amount });
            setDone({ id: data.transactionId });
          });
    call.finally(() => setLoading(false));
  }

  if (done) {
    return (
      <SuccessScreen
        title={tab === "ted" ? "TED em processamento!" : "P2P transferido!"}
        amount={brl(amount)}
        details={[
          ...(tab === "ted"
            ? [
                { label: "Favorecido", value: ted.name },
                { label: "Banco", value: bankName(ted.bankCode) },
                { label: "Agência · Conta", value: `${ted.branch} · ${ted.account}` },
                { label: "Previsão", value: done.eta ?? "—" },
              ]
            : [
                { label: "Conta destino", value: `Linear · ${p2pAccount}` },
                { label: "Liquidação", value: "Instantânea · sem tarifa" },
              ]),
          { label: "Data", value: dateTimeBR(new Date().toISOString()) },
          { label: "ID da transação", value: done.id },
        ]}
      />
    );
  }

  return (
    <FlowPage title="Transferir" subtitle="TED para outros bancos ou P2P Linear">
      <div className="anim-rise flex h-full flex-col">
        {/* Abas */}
        <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-white/4 p-1 text-[13px] font-semibold">
          {(
            [
              ["ted", "TED · outros bancos"],
              ["p2p", "P2P · contas Linear"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-xl py-2.5 transition-all ${
                tab === k ? "bg-brand-500 text-navy-950" : "text-white/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {tab === "ted" ? (
            <>
              <Field label="Banco destino">
                <Select value={ted.bankCode} onChange={(e) => setTed({ ...ted, bankCode: e.target.value })}>
                  <option value="341">341 — Itaú Unibanco</option>
                  <option value="001">001 — Banco do Brasil</option>
                  <option value="237">237 — Bradesco</option>
                  <option value="104">104 — Caixa Econômica</option>
                  <option value="260">260 — Nubank</option>
                  <option value="077">077 — Inter</option>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Agência">
                  <TextInput inputMode="numeric" placeholder="0001" value={ted.branch} onChange={(e) => setTed({ ...ted, branch: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
                </Field>
                <Field label="Conta com dígito">
                  <TextInput inputMode="numeric" placeholder="12345-6" value={ted.account} onChange={(e) => setTed({ ...ted, account: e.target.value.slice(0, 12) })} />
                </Field>
              </div>
              <Field label="Nome do favorecido">
                <TextInput placeholder="Nome completo" value={ted.name} onChange={(e) => setTed({ ...ted, name: e.target.value })} />
              </Field>
              <Field label="CPF/CNPJ">
                <TextInput inputMode="numeric" placeholder="000.000.000-00" value={ted.document} onChange={(e) => setTed({ ...ted, document: maskCpf(e.target.value) })} />
              </Field>
            </>
          ) : (
            <Field label="Conta Linear destino" hint="Transferência instantânea e gratuita entre contas Linear.">
              <TextInput inputMode="numeric" placeholder="0000000-0" value={p2pAccount} onChange={(e) => setP2pAccount(e.target.value.slice(0, 9))} />
            </Field>
          )}
        </div>

        <div className="mt-6">
          <AmountInput value={amount} onChange={setAmount} max={balance} />
        </div>

        <Button
          className="mt-auto w-full"
          disabled={!formOk || amount <= 0 || amount > balance}
          loading={loading}
          onClick={send}
        >
          {loading ? "Processando..." : tab === "ted" ? "Transferir via TED" : "Transferir P2P"}
        </Button>
      </div>
    </FlowPage>
  );
}

function bankName(code: string) {
  return (
    {
      "341": "Itaú Unibanco",
      "001": "Banco do Brasil",
      "237": "Bradesco",
      "104": "Caixa Econômica",
      "260": "Nubank",
      "077": "Inter",
    }[code] ?? code
  );
}
