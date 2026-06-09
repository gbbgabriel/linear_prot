import { useState } from "react";
import { Vault } from "lucide-react";
import { FlowPage } from "../../components/mobile/FlowPage";
import { Button } from "../../components/ui/Button";
import { Field, TextInput, Select } from "../../components/ui/Field";
import { StatusBadge } from "../../components/ui/Badge";
import { hiperbanco } from "../../lib/hiperbanco";

interface Nominal { accountId: string; branch: string; number: string; purpose: string; holderName: string }

/** Conta Nominal — conta de custódia/escrow em nome de terceiros. */
export function ContaNominal() {
  const [purpose, setPurpose] = useState("ESCROW");
  const [holder, setHolder] = useState("");
  const [created, setCreated] = useState<Nominal | null>(null);
  const [loading, setLoading] = useState(false);

  function create() {
    setLoading(true);
    hiperbanco
      .criarContaNominal({ purpose, holderName: holder })
      .then(({ data }) => setCreated(data))
      .finally(() => setLoading(false));
  }

  return (
    <FlowPage title="Conta nominal" subtitle="Custódia e escrow para sua operação">
      {!created ? (
        <div className="anim-rise flex h-full flex-col space-y-5">
          <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 p-4 text-[13px] leading-relaxed text-white/55">
            <Vault size={20} className="mt-0.5 shrink-0 text-brand-400" />
            Contas nominais permitem segregar recursos de terceiros (marketplaces, garantias,
            transações imobiliárias) com titularidade identificada e movimentação controlada.
          </div>
          <Field label="Finalidade">
            <Select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="ESCROW">Escrow / garantia</option>
              <option value="MARKETPLACE">Repasse de marketplace</option>
              <option value="IMOBILIARIO">Transação imobiliária</option>
              <option value="JUDICIAL">Depósito judicial</option>
            </Select>
          </Field>
          <Field label="Titular beneficiário">
            <TextInput placeholder="Nome ou razão social" value={holder} onChange={(e) => setHolder(e.target.value)} />
          </Field>
          <div className="!mt-auto pt-6">
            <Button className="w-full" disabled={holder.length < 4} loading={loading} onClick={create}>
              {loading ? "Abrindo conta nominal..." : "Abrir conta nominal"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="anim-rise flex flex-col items-center pt-8 text-center">
          <div className="anim-pop grid h-20 w-20 place-items-center rounded-full bg-positive/12 text-positive ring-1 ring-positive/30">
            <Vault size={32} />
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold">Conta nominal ativa!</h2>
          <div className="mt-6 w-full rounded-2xl border border-white/8 bg-white/4 p-5 text-left text-sm">
            {[
              ["Titular", created.holderName],
              ["Finalidade", created.purpose],
              ["Agência · Conta", `${created.branch} · ${created.number}`],
              ["ID", created.accountId],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <span className="text-white/45">{k}</span>
                <span className="max-w-[60%] text-right font-medium break-all">{v}</span>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-2">
              <span className="text-white/45">Status</span>
              <StatusBadge status="ACTIVE" />
            </div>
          </div>
        </div>
      )}
    </FlowPage>
  );
}
