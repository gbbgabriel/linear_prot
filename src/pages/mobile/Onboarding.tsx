import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Fingerprint, UserRound } from "lucide-react";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { Field, TextInput, Select } from "../../components/ui/Field";
import { hiperbanco, OCCUPATIONS, type RegistroPF } from "../../lib/hiperbanco";
import { maskCpf, maskCnpj, maskDate, maskPhone } from "../../lib/format";

/**
 * Onboarding & KYC — espelha o payload exato de
 * `hiperbanco.registroDePessoaFisica({ documentType, occupation, pep, ... })`.
 */

type Step = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = ["Tipo de conta", "Dados pessoais", "Documento", "Perfil KYC", "Revisão"];

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [kind, setKind] = useState<"pf" | "pj">("pf");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ idClient: string; account: string } | null>(null);

  const [form, setForm] = useState<RegistroPF & { cnpj?: string; companyName?: string }>({
    fullName: "",
    cpf: "",
    birthDate: "",
    phone: "",
    email: "",
    documentType: "RG",
    occupation: "OCP0001",
    pep: "NONE",
    nationality: "BRASILEIRO",
    relationshipStatus: "SOLTEIRO",
    education: "SUPERIOR",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    step === 0 ||
    (step === 1 &&
      (kind === "pj"
        ? !!form.companyName && (form.cnpj?.length ?? 0) === 18
        : form.fullName.length > 5 && form.cpf.length === 14 && form.birthDate.length === 10)) ||
    step === 2 ||
    step === 3 ||
    step === 4;

  async function submit() {
    setLoading(true);
    // Chamada idêntica à do SDK real — veja src/lib/hiperbanco.ts
    const call =
      kind === "pf"
        ? hiperbanco.registroDePessoaFisica(form, { idClient: "idClient" })
        : hiperbanco.registroDePessoaJuridica({
            companyName: form.companyName ?? "",
            cnpj: form.cnpj ?? "",
            email: form.email,
          });
    call
      .then(({ data }) => {
        setDone({
          idClient: data.idClient,
          account: "account" in data && data.account ? `${(data as any).account.branch} · ${(data as any).account.number}` : "0001 · em emissão",
        });
      })
      .catch((err) => console.error("[hiperbanco] registro falhou", err))
      .finally(() => setLoading(false));
  }

  if (done) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="anim-pop grid h-24 w-24 place-items-center rounded-full bg-positive/12 ring-1 ring-positive/30">
            <CheckCircle2 size={44} className="text-positive" />
          </div>
          <h1 className="anim-rise d-2 mt-6 font-display text-2xl font-semibold">Cadastro enviado!</h1>
          <p className="anim-rise d-3 mt-3 max-w-xs text-sm leading-relaxed text-white/55">
            Seu KYC está <span className="text-brand-400">em análise</span>. Você já pode explorar
            sua conta enquanto validamos seus dados.
          </p>
          <div className="anim-rise d-4 mt-8 w-full rounded-2xl border border-white/8 bg-white/4 p-4 text-left text-sm">
            <Row k="idClient" v={done.idClient} mono />
            <Row k="Agência · Conta" v={done.account} mono />
            <Row k="Status KYC" v="UNDER_REVIEW" mono />
          </div>
          <Button className="anim-rise d-5 mt-8 w-full" onClick={() => navigate("/app")}>
            Entrar na minha conta <ArrowRight size={18} />
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Progresso */}
      <div className="px-6 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step === 0 ? navigate("/") : setStep((s) => (s - 1) as Step))}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/6 text-white/70"
            aria-label="Voltar"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-medium text-white/40">
              <span>{STEP_LABELS[step]}</span>
              <span className="tnum">{step + 1}/5</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${((step + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8" key={step}>
        {step === 0 && (
          <div className="anim-rise">
            <h1 className="font-display text-2xl font-semibold leading-snug">
              Vamos abrir sua <span className="text-brand-400">conta Linear</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">Escolha o tipo de conta para começar.</p>
            <div className="mt-8 space-y-4">
              {(
                [
                  { k: "pf", icon: UserRound, t: "Pessoa Física", d: "Conta completa com Pix, cartões e crédito CCB." },
                  { k: "pj", icon: Building2, t: "Pessoa Jurídica", d: "Conta empresarial com folha de pagamento e pagamento em lote." },
                ] as const
              ).map(({ k, icon: Icon, t, d }) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                    kind === k
                      ? "border-brand-500/60 bg-brand-500/8 shadow-[0_0_0_1px_rgba(224,133,54,0.3)]"
                      : "border-white/10 bg-white/4 hover:bg-white/7"
                  }`}
                >
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${kind === k ? "bg-brand-500/20 text-brand-400" : "bg-white/8 text-white/60"}`}>
                    <Icon size={22} />
                  </span>
                  <span>
                    <span className="block font-display font-semibold">{t}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-white/50">{d}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="anim-rise space-y-5">
            <h1 className="font-display text-2xl font-semibold">
              {kind === "pf" ? "Seus dados" : "Dados da empresa"}
            </h1>
            {kind === "pf" ? (
              <>
                <Field label="Nome completo">
                  <TextInput placeholder="Como no seu documento" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                </Field>
                <Field label="CPF">
                  <TextInput inputMode="numeric" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => set("cpf", maskCpf(e.target.value))} />
                </Field>
                <Field label="Data de nascimento">
                  <TextInput inputMode="numeric" placeholder="DD/MM/AAAA" value={form.birthDate} onChange={(e) => set("birthDate", maskDate(e.target.value))} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Razão social">
                  <TextInput placeholder="Empresa LTDA" value={form.companyName ?? ""} onChange={(e) => set("companyName", e.target.value)} />
                </Field>
                <Field label="CNPJ">
                  <TextInput inputMode="numeric" placeholder="00.000.000/0000-00" value={form.cnpj ?? ""} onChange={(e) => set("cnpj", maskCnpj(e.target.value))} />
                </Field>
              </>
            )}
            <Field label="Celular">
              <TextInput inputMode="numeric" placeholder="(11) 90000-0000" value={form.phone} onChange={(e) => set("phone", maskPhone(e.target.value))} />
            </Field>
            <Field label="E-mail">
              <TextInput type="email" placeholder="voce@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="anim-rise space-y-5">
            <h1 className="font-display text-2xl font-semibold">Documento de identidade</h1>
            <p className="text-sm text-white/50">
              Campo <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-brand-300">documentType</code> do
              registro Hiperbanco.
            </p>
            <Field label="Tipo de documento">
              <Select value={form.documentType} onChange={(e) => set("documentType", e.target.value as RegistroPF["documentType"])}>
                <option value="RG">RG — Registro Geral</option>
                <option value="CNH">CNH — Carteira de Motorista</option>
                <option value="RNE">RNE — Registro Nacional de Estrangeiro</option>
              </Select>
            </Field>
            <Field label="Nacionalidade">
              <Select value={form.nationality} onChange={(e) => set("nationality", e.target.value as RegistroPF["nationality"])}>
                <option value="BRASILEIRO">Brasileira</option>
                <option value="ESTRANGEIRO">Estrangeira</option>
              </Select>
            </Field>
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-6 text-center">
              <Fingerprint size={32} className="mx-auto text-brand-400" />
              <p className="mt-3 text-sm font-medium">Envio de foto do documento</p>
              <p className="mt-1 text-xs text-white/40">Simulado neste protótipo — captura via câmera no app final.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="anim-rise space-y-5">
            <h1 className="font-display text-2xl font-semibold">Perfil declaratório</h1>
            <p className="text-sm text-white/50">Informações exigidas pelo Banco Central para o KYC.</p>
            <Field label="Ocupação (occupation)">
              <Select value={form.occupation} onChange={(e) => set("occupation", e.target.value)}>
                {OCCUPATIONS.map((o) => (
                  <option key={o.code} value={o.code}>{o.label} · {o.code}</option>
                ))}
              </Select>
            </Field>
            <Field label="Escolaridade (education)">
              <Select value={form.education} onChange={(e) => set("education", e.target.value as RegistroPF["education"])}>
                <option value="NAO_ALFABETIZADO">Não alfabetizado</option>
                <option value="FUNDAMENTAL">Ensino fundamental</option>
                <option value="MEDIO">Ensino médio</option>
                <option value="SUPERIOR">Ensino superior</option>
                <option value="POS_GRADUACAO">Pós-graduação</option>
              </Select>
            </Field>
            <Field label="Estado civil (relationshipStatus)">
              <Select value={form.relationshipStatus} onChange={(e) => set("relationshipStatus", e.target.value as RegistroPF["relationshipStatus"])}>
                <option value="SOLTEIRO">Solteiro(a)</option>
                <option value="CASADO">Casado(a)</option>
                <option value="DIVORCIADO">Divorciado(a)</option>
                <option value="VIUVO">Viúvo(a)</option>
                <option value="UNIAO_ESTAVEL">União estável</option>
              </Select>
            </Field>
            <Field label="Pessoa politicamente exposta (pep)" hint="Exigência regulatória — Circular BCB nº 3.978.">
              <Select value={form.pep} onChange={(e) => set("pep", e.target.value as RegistroPF["pep"])}>
                <option value="NONE">Não sou PEP</option>
                <option value="SELF">Sou PEP</option>
                <option value="RELATED">Relacionado a PEP</option>
              </Select>
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="anim-rise">
            <h1 className="font-display text-2xl font-semibold">Revise seus dados</h1>
            <p className="mt-2 text-sm text-white/50">
              Payload enviado para{" "}
              <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-brand-300">
                hiperbanco.registroDePessoa{kind === "pf" ? "Fisica" : "Juridica"}()
              </code>
            </p>
            <div className="mt-6 rounded-2xl border border-white/8 bg-navy-900/80 p-4 font-mono text-[12px] leading-relaxed text-white/70">
              <span className="text-white/35">{"{"}</span>
              {kind === "pf" ? (
                <>
                  <Json k="fullName" v={form.fullName || "—"} />
                  <Json k="cpf" v={form.cpf || "—"} />
                  <Json k="documentType" v={form.documentType} accent />
                  <Json k="occupation" v={form.occupation} accent />
                  <Json k="pep" v={form.pep} accent />
                  <Json k="nationality" v={form.nationality} accent />
                  <Json k="relationshipStatus" v={form.relationshipStatus} accent />
                  <Json k="education" v={form.education} accent />
                </>
              ) : (
                <>
                  <Json k="companyName" v={form.companyName ?? "—"} />
                  <Json k="cnpj" v={form.cnpj ?? "—"} />
                  <Json k="email" v={form.email || "—"} />
                </>
              )}
              <span className="text-white/35">{"}"}</span>
              <span className="text-white/35">, {"{"} idClient: <span className="text-brand-300">'idClient'</span> {"}"}</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Ao continuar você concorda com os termos de uso e autoriza a consulta dos seus dados
              junto a bureaus de crédito, conforme a LGPD.
            </p>
          </div>
        )}
      </div>

      <div className="px-6 pb-8 pt-4">
        <Button
          className="w-full"
          disabled={!canNext}
          loading={loading}
          onClick={() => (step === 4 ? submit() : setStep((s) => (s + 1) as Step))}
        >
          {step === 4 ? (loading ? "Enviando KYC..." : "Abrir minha conta") : "Continuar"}
          {!loading && <ArrowRight size={18} />}
        </Button>
        {step === 0 && (
          <p className="mt-4 text-center text-[13px] text-white/40">
            Já tem conta?{" "}
            <Link to="/app" className="font-semibold text-brand-400">Entrar</Link>
          </p>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-navy-950">
      <div className="noise relative flex min-h-dvh w-full max-w-[450px] flex-col bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950">
        <header className="flex justify-center pb-2 pt-7">
          <Logo size={15} />
        </header>
        {children}
      </div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-white/45">{k}</span>
      <span className={mono ? "font-mono text-[12px] text-brand-300" : "font-medium"}>{v}</span>
    </div>
  );
}

function Json({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="pl-4">
      <span className="text-sky-300">{k}</span>
      <span className="text-white/35">: </span>
      <span className={accent ? "text-brand-300" : "text-emerald-300"}>'{v}'</span>
      <span className="text-white/35">,</span>
    </div>
  );
}
