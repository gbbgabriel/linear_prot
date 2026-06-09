import { Link } from "react-router-dom";
import { Smartphone, MonitorDot, ArrowUpRight, ShieldCheck, Landmark, Zap } from "lucide-react";
import { Logo } from "../components/ui/Logo";

/** Gateway do protótipo: escolhe entre App do Cliente e Backoffice. */
export function Launcher() {
  return (
    <div className="noise relative flex min-h-dvh flex-col overflow-hidden bg-navy-950">
      {/* Atmosfera */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-navy-800/50 blur-[140px]" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-brand-500/12 blur-[120px]" />
        {/* Linhas diagonais sutis */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]">
          <defs>
            <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0v56" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <header className="relative z-10 flex items-center justify-between px-8 py-7 md:px-14">
        <Logo size={20} />
        <span className="rounded-full border border-white/12 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-white/50">
          PROTÓTIPO · POWERED BY HIPERBANCO API
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-8 pb-16 md:px-14">
        <p className="anim-rise font-display text-[13px] font-semibold tracking-[0.4em] text-brand-500">
          BANCO DIGITAL · BAAS · CREDIT-AS-A-SERVICE
        </p>
        <h1 className="anim-rise d-1 mt-4 max-w-2xl font-display text-4xl font-light leading-[1.12] md:text-6xl">
          O banco que move o seu negócio em <span className="font-semibold text-brand-400">linha reta</span>.
        </h1>
        <p className="anim-rise d-2 mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
          Conta digital PF e PJ, Pix, TED, boletos, cartões e emissão de CCB —
          tudo integrado à API FullBanking do Hiperbanco. Escolha uma interface
          para explorar o protótipo.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Link
            to="/onboarding"
            className="anim-rise d-3 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800/80 to-navy-900/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_24px_60px_-20px_rgba(224,133,54,0.25)]"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                <Smartphone size={22} />
              </span>
              <ArrowUpRight size={20} className="text-white/30 transition group-hover:text-brand-400" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold">App do Cliente</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">
              Experiência mobile-first: onboarding KYC, conta PF/PJ, Pix,
              crédito CCB, cartões e serviços.
            </p>
            <span className="mt-5 inline-block text-[12px] font-semibold tracking-wider text-brand-400">
              INICIAR PELO ONBOARDING →
            </span>
          </Link>

          <Link
            to="/admin"
            className="anim-rise d-4 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 to-white/2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_60px_-20px_rgba(255,255,255,0.08)]"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-white">
                <MonitorDot size={22} />
              </span>
              <ArrowUpRight size={20} className="text-white/30 transition group-hover:text-white" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold">Backoffice Admin</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/50">
              Painel da operação: esteira de KYC, aprovação de CCBs e
              relatórios de volumetria cash-in/cash-out.
            </p>
            <span className="mt-5 inline-block text-[12px] font-semibold tracking-wider text-white/60">
              ACESSAR PAINEL →
            </span>
          </Link>
        </div>

        <div className="anim-rise d-5 mt-12 flex flex-wrap gap-x-10 gap-y-3 text-[12px] text-white/40">
          <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-brand-500" /> KYC nativo da API Hiperbanco</span>
          <span className="flex items-center gap-2"><Landmark size={15} className="text-brand-500" /> Emissão de CCB com assinatura digital</span>
          <span className="flex items-center gap-2"><Zap size={15} className="text-brand-500" /> Pix, TED, P2P e boletos em tempo real</span>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/6 px-8 py-5 text-[11px] tracking-wide text-white/30 md:px-14">
        LINEAR BANCO DIGITAL · Ambiente de demonstração — nenhuma transação real é executada · docs.hiperbanco.com.br
      </footer>
    </div>
  );
}
