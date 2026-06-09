import { Link } from "react-router-dom";
import {
  Building2, ChevronRight, FileBadge, HeadphonesIcon, KeyRound, LogOut,
  ShieldCheck, UserRound, Vault,
} from "lucide-react";
import { useBank } from "../../context/BankContext";
import { Badge } from "../../components/ui/Badge";

/** Perfil — dados do cliente, troca PF/PJ e atalhos institucionais. */
export function Perfil() {
  const { user, company, profile, setProfile } = useBank();

  return (
    <div className="anim-fadein px-5 pt-8">
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-2xl font-bold text-navy-950">
          {profile === "pf" ? "MS" : "BV"}
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold">
          {profile === "pf" ? user.name : company.name}
        </h1>
        <p className="mt-1 text-[13px] text-white/45">
          {profile === "pf" ? `CPF ${user.cpf}` : `CNPJ ${company.cnpj}`} · Ag {user.branch} · Cc{" "}
          {profile === "pf" ? user.account : company.account}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge tone="success">KYC aprovado</Badge>
          <Badge tone="info">idClient: {user.idClient.slice(0, 14)}…</Badge>
        </div>
      </div>

      {/* Troca de perfil */}
      <div className="anim-rise d-1 mt-7 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
        {(
          [
            { k: "pf" as const, icon: UserRound, t: "Conta Pessoa Física", d: user.name },
            { k: "pj" as const, icon: Building2, t: "Conta Pessoa Jurídica", d: company.name },
          ]
        ).map(({ k, icon: Icon, t, d }, i) => (
          <button
            key={k}
            onClick={() => setProfile(k)}
            className={`flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-white/5 ${i === 0 ? "border-b border-white/6" : ""}`}
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${profile === k ? "bg-brand-500/18 text-brand-400" : "bg-white/6 text-white/55"}`}>
              <Icon size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-medium">{t}</span>
              <span className="block truncate text-[12px] text-white/40">{d}</span>
            </span>
            <span className={`h-2.5 w-2.5 rounded-full ${profile === k ? "bg-brand-500" : "bg-white/15"}`} />
          </button>
        ))}
      </div>

      {/* Menu */}
      <div className="anim-rise d-2 mt-5 overflow-hidden rounded-2xl border border-white/8 bg-white/3 mb-6">
        {[
          { icon: ShieldCheck, t: "Dados do KYC", d: "documentType, occupation, pep, education..." },
          { icon: KeyRound, t: "Minhas chaves Pix", d: "1 chave ativa" },
          { icon: Vault, t: "Conta nominal", d: "Custódia e escrow para terceiros", to: "/app/nominal" },
          { icon: FileBadge, t: "Contratos e documentos", d: "CCBs, termos e comprovantes" },
          { icon: HeadphonesIcon, t: "Atendimento", d: "Chat 24h, e-mail e ouvidoria" },
        ].map(({ icon: Icon, t, d, to }, i, arr) => {
          const inner = (
            <>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/6 text-white/60">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium">{t}</span>
                <span className="block truncate text-[12px] text-white/40">{d}</span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-white/25" />
            </>
          );
          const cls = `flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-white/5 ${i < arr.length - 1 ? "border-b border-white/6" : ""}`;
          return to ? (
            <Link key={t} to={to} className={cls}>{inner}</Link>
          ) : (
            <button key={t} className={cls}>{inner}</button>
          );
        })}
      </div>

      <Link
        to="/"
        className="anim-rise d-3 mb-8 flex items-center justify-center gap-2 rounded-2xl border border-negative/25 bg-negative/8 py-3.5 text-[14px] font-semibold text-negative transition hover:bg-negative/15"
      >
        <LogOut size={17} /> Sair da conta
      </Link>
    </div>
  );
}
