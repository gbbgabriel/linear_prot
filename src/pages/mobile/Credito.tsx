import { useState } from "react";
import { ChevronRight, FileSignature, HandCoins, ShieldCheck, Sparkles } from "lucide-react";
import { SuccessScreen } from "../../components/mobile/SuccessScreen";
import { Button } from "../../components/ui/Button";
import { Field, TextInput } from "../../components/ui/Field";
import { StatusBadge } from "../../components/ui/Badge";
import { hiperbanco } from "../../lib/hiperbanco";
import { useBank } from "../../context/BankContext";
import { brl, dateBR } from "../../lib/format";

/**
 * Crédito & CCB — o diferencial do Linear.
 * Fluxo: simulação → revisão da cédula → assinatura digital → desembolso via Pix.
 */

type Simulation = {
  simulationId: string;
  amount: number;
  installments: number;
  monthlyRate: number;
  cetYearly: number;
  iof: number;
  installmentValue: number;
  totalAmount: number;
  firstDueDate: string;
};

type Stage = "hub" | "simulate" | "review" | "sign" | "done";

const LIMIT = 50_000;

export function Credito() {
  const { ccbs, addCcb, signCcb, applyTx } = useBank();
  const [stage, setStage] = useState<Stage>("hub");
  const [amount, setAmount] = useState(20_000);
  const [installments, setInstallments] = useState(24);
  const [sim, setSim] = useState<Simulation | null>(null);
  const [ccb, setCcb] = useState<{ ccbId: string; ccbNumber: string } | null>(null);
  const [cpfConfirm, setCpfConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function simulate() {
    setLoading(true);
    hiperbanco
      .simularCCB({ amount, installments })
      .then(({ data }) => {
        setSim(data);
        setStage("review");
      })
      .finally(() => setLoading(false));
  }

  function emit() {
    setLoading(true);
    hiperbanco
      .emitirCCB({ simulationId: sim!.simulationId, amount, installments })
      .then(({ data }) => {
        setCcb(data);
        addCcb({
          id: data.ccbId,
          number: data.ccbNumber,
          amount,
          installments,
          installmentValue: sim!.installmentValue,
          status: "AWAITING_SIGNATURE",
          createdAt: new Date().toISOString(),
        });
        setStage("sign");
      })
      .finally(() => setLoading(false));
  }

  function sign() {
    setLoading(true);
    hiperbanco
      .assinarCCB(ccb!.ccbId, { signerDocument: cpfConfirm, otp })
      .then(() => {
        signCcb(ccb!.ccbId);
        applyTx({ kind: "ccb_in", title: "Crédito CCB liberado", counterpart: ccb!.ccbNumber, amount });
        setStage("done");
      })
      .finally(() => setLoading(false));
  }

  if (stage === "done" && sim && ccb) {
    return (
      <SuccessScreen
        title="CCB assinada — crédito liberado!"
        amount={brl(sim.amount)}
        doneTo="/app"
        details={[
          { label: "Cédula", value: ccb.ccbNumber },
          { label: "Parcelas", value: `${sim.installments}x de ${brl(sim.installmentValue)}` },
          { label: "1º vencimento", value: new Date(sim.firstDueDate).toLocaleDateString("pt-BR") },
          { label: "Desembolso", value: "Via Pix · em até 10 min" },
          { label: "Assinatura", value: "ICP-Brasil · e-sign" },
        ]}
      />
    );
  }

  return (
    <div className="anim-fadein px-5 pt-8">
      {stage === "hub" && (
        <>
          <h1 className="font-display text-2xl font-semibold">Crédito</h1>
          <p className="mt-1 text-sm text-white/50">Emissão de CCB 100% digital via Hiperbanco.</p>

          <div className="anim-rise d-1 relative mt-6 overflow-hidden rounded-3xl border border-brand-500/25 bg-gradient-to-br from-brand-500/15 via-navy-800 to-navy-900 p-6">
            <Sparkles size={18} className="text-brand-400" />
            <p className="mt-3 text-[13px] text-white/60">Limite pré-aprovado para você</p>
            <p className="tnum font-display text-[32px] font-bold text-white">{brl(LIMIT)}</p>
            <p className="mt-1 text-[12px] text-white/45">Taxa a partir de 2,19% a.m. · até 48x</p>
            <Button className="mt-5 w-full" onClick={() => setStage("simulate")}>
              <HandCoins size={18} /> Simular agora
            </Button>
          </div>

          <h2 className="anim-rise d-2 mt-8 font-display text-[15px] font-semibold text-white/85">
            Meus contratos
          </h2>
          <div className="anim-rise d-3 mt-3 space-y-2.5 pb-4">
            {ccbs.map((c) => (
              <div key={c.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[12px] text-brand-300">{c.number}</p>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="tnum font-display text-lg font-bold">{brl(c.amount)}</p>
                    <p className="text-[12px] text-white/40">
                      {c.installments}x de <span className="tnum">{brl(c.installmentValue)}</span> · emitida em {dateBR(c.createdAt)}
                    </p>
                  </div>
                  <ChevronRight size={17} className="text-white/25" />
                </div>
              </div>
            ))}
            {!ccbs.length && (
              <p className="rounded-2xl border border-dashed border-white/12 p-6 text-center text-sm text-white/40">
                Você ainda não possui contratos de crédito.
              </p>
            )}
          </div>
        </>
      )}

      {stage === "simulate" && (
        <div className="anim-rise">
          <button onClick={() => setStage("hub")} className="text-[13px] font-semibold text-brand-400">← Voltar</button>
          <h1 className="mt-3 font-display text-2xl font-semibold">Simular crédito</h1>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <p className="text-[13px] text-white/55">Quanto você precisa?</p>
              <p className="tnum font-display text-2xl font-bold text-brand-400">{brl(amount)}</p>
            </div>
            <input
              type="range"
              min={1000}
              max={LIMIT}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-4 w-full accent-brand-500"
            />
            <div className="flex justify-between text-[11px] text-white/35">
              <span className="tnum">R$ 1.000</span>
              <span className="tnum">{brl(LIMIT)}</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-2.5 text-[13px] text-white/55">Em quantas parcelas?</p>
            <div className="grid grid-cols-4 gap-2">
              {[6, 12, 24, 36, 48].map((n) => (
                <button
                  key={n}
                  onClick={() => setInstallments(n)}
                  className={`tnum rounded-xl border py-3 text-[14px] font-bold transition ${
                    installments === n
                      ? "border-brand-500 bg-brand-500/15 text-brand-400"
                      : "border-white/10 bg-white/4 text-white/60"
                  }`}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>

          <Button className="mt-10 w-full" loading={loading} onClick={simulate}>
            {loading ? "Calculando na Hiperbanco..." : "Ver condições"}
          </Button>
        </div>
      )}

      {stage === "review" && sim && (
        <div className="anim-rise pb-6">
          <button onClick={() => setStage("simulate")} className="text-[13px] font-semibold text-brand-400">← Refazer simulação</button>
          <h1 className="mt-3 font-display text-2xl font-semibold">Sua proposta de CCB</h1>
          <p className="mt-1 text-sm text-white/50">Cédula de Crédito Bancário · Lei 10.931/04</p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-6">
            <p className="text-[12px] text-white/45">Você recebe via Pix</p>
            <p className="tnum font-display text-[34px] font-bold text-brand-400">{brl(sim.amount)}</p>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/8 pt-5 text-sm">
              <Cell k="Parcelas" v={`${sim.installments}x ${brl(sim.installmentValue)}`} />
              <Cell k="Taxa de juros" v={`${(sim.monthlyRate * 100).toFixed(2).replace(".", ",")}% a.m.`} />
              <Cell k="CET anual" v={`${(sim.cetYearly * 100).toFixed(2).replace(".", ",")}% a.a.`} />
              <Cell k="IOF" v={brl(sim.iof)} />
              <Cell k="Total a pagar" v={brl(sim.totalAmount)} />
              <Cell k="1º vencimento" v={new Date(sim.firstDueDate).toLocaleDateString("pt-BR")} />
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 p-4 text-[12px] leading-relaxed text-white/50">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-positive" />
            Operação estruturada como CCB e registrada na B3, com custódia e liquidação pela
            instituição parceira Hiperbanco (ISPB 18236120).
          </div>

          <Button className="mt-6 w-full" loading={loading} onClick={emit}>
            {loading ? "Emitindo cédula..." : "Emitir CCB e ir para assinatura"}
          </Button>
        </div>
      )}

      {stage === "sign" && sim && ccb && (
        <div className="anim-rise pb-6">
          <h1 className="font-display text-2xl font-semibold">Assinatura digital</h1>
          <p className="mt-1 text-sm text-white/50">
            Cédula <span className="font-mono text-[13px] text-brand-300">{ccb.ccbNumber}</span> aguardando assinatura.
          </p>

          {/* Documento resumido */}
          <div className="mt-6 max-h-44 overflow-y-auto rounded-2xl border border-white/10 bg-white p-5 text-[11px] leading-relaxed text-navy-800">
            <p className="font-display text-[13px] font-bold text-navy-800">CÉDULA DE CRÉDITO BANCÁRIO Nº {ccb.ccbNumber}</p>
            <p className="mt-2">
              EMITENTE: Marcos Andrade Silveira, CPF 412.•••.•••-10. CREDOR: Linear Instituição de
              Pagamento S.A., na qualidade de correspondente da Hiperbanco S.A.
            </p>
            <p className="mt-2">
              VALOR DO PRINCIPAL: {brl(sim.amount)}. ENCARGOS: juros remuneratórios de{" "}
              {(sim.monthlyRate * 100).toFixed(2).replace(".", ",")}% a.m., capitalizados mensalmente (Tabela Price).
              CET: {(sim.cetYearly * 100).toFixed(2).replace(".", ",")}% a.a. PRAZO: {sim.installments} parcelas mensais de {brl(sim.installmentValue)}.
            </p>
            <p className="mt-2">
              O Emitente declara ter lido as condições gerais, autorizando o débito das parcelas em
              conta e o registro da cédula nos termos da Lei nº 10.931/2004.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <Field label="Confirme seu CPF">
              <TextInput
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpfConfirm}
                onChange={(e) => setCpfConfirm(e.target.value)}
              />
            </Field>
            <Field label="Token enviado por SMS" hint="Use 000000 neste protótipo.">
              <TextInput
                inputMode="numeric"
                placeholder="6 dígitos"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </Field>
          </div>

          <Button
            className="mt-8 w-full"
            disabled={cpfConfirm.length < 11 || otp.length !== 6}
            loading={loading}
            onClick={sign}
          >
            <FileSignature size={18} />
            {loading ? "Registrando assinatura..." : "Assinar e receber o crédito"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] text-white/40">{k}</p>
      <p className="tnum mt-0.5 font-semibold">{v}</p>
    </div>
  );
}
