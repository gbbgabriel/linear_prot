import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft, ArrowUpRight, Banknote, Barcode, Bell, ChevronRight, CreditCard,
  Eye, EyeOff, HandCoins, Landmark, Layers, QrCode, Repeat, Smartphone, Users, Vault,
} from "lucide-react";
import { useBank, type Tx } from "../../context/BankContext";
import { brl, dateBR } from "../../lib/format";

const txIcon: Record<Tx["kind"], React.ElementType> = {
  pix_in: ArrowDownLeft, pix_out: ArrowUpRight, ted_in: ArrowDownLeft, ted_out: ArrowUpRight,
  p2p_in: ArrowDownLeft, p2p_out: ArrowUpRight, boleto: Barcode, recarga: Smartphone,
  saque: Banknote, folha: Users, ccb_in: HandCoins, cartao: CreditCard,
};

const services = [
  { to: "/app/pix", icon: QrCode, label: "Pix" },
  { to: "/app/pagar/boleto", icon: Barcode, label: "Pagar conta" },
  { to: "/app/transferir", icon: Landmark, label: "TED" },
  { to: "/app/transferir?tab=p2p", icon: Repeat, label: "P2P Linear" },
  { to: "/app/credito", icon: HandCoins, label: "Crédito CCB" },
  { to: "/app/pagar/recarga", icon: Smartphone, label: "Recargas" },
  { to: "/app/pagar/saque", icon: Banknote, label: "Saque 24h" },
  { to: "/app/pagar/lote", icon: Layers, label: "Pag. em lote", pj: true },
  { to: "/app/pagar/folha", icon: Users, label: "Folha", pj: true },
  { to: "/app/nominal", icon: Vault, label: "Conta nominal", pj: true },
];

export function Home() {
  const { user, company, profile, setProfile, balance, txs } = useBank();
  const [hide, setHide] = useState(false);

  return (
    <div className="anim-fadein">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-7">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-sm font-bold text-navy-950">
            {profile === "pf" ? "MS" : "BV"}
          </span>
          <div>
            <p className="text-[12px] text-white/45">{profile === "pf" ? "Olá," : "Conta empresa"}</p>
            <p className="font-display text-[15px] font-semibold leading-tight">
              {profile === "pf" ? user.firstName : company.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Troca de perfil PF/PJ */}
          <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5 text-[11px] font-bold">
            {(["pf", "pj"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                className={`rounded-full px-3 py-1.5 uppercase tracking-wide transition-all ${
                  profile === p ? "bg-brand-500 text-navy-950" : "text-white/45"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="relative grid h-10 w-10 place-items-center rounded-full bg-white/6 text-white/70" aria-label="Notificações">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
          </button>
        </div>
      </header>

      {/* Cartão de saldo */}
      <section className="anim-rise d-1 mx-5 mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 relative">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium tracking-wide text-white/50">
            Saldo disponível · Ag {user.branch} · Cc {profile === "pf" ? user.account : company.account}
          </p>
          <button onClick={() => setHide((h) => !h)} className="text-white/50" aria-label="Mostrar/ocultar saldo">
            {hide ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        <p className="tnum mt-2 font-display text-[34px] font-bold tracking-tight">
          {hide ? "R$ ••••••" : brl(balance)}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <QuickAction to="/app/pix/enviar" icon={ArrowUpRight} label="Enviar Pix" primary />
          <QuickAction to="/app/pix/receber" icon={ArrowDownLeft} label="Receber" />
          <QuickAction to="/app/pagar/boleto" icon={Barcode} label="Pagar" />
        </div>
      </section>

      {/* Crédito pré-aprovado (gancho para CCB) */}
      <Link
        to="/app/credito"
        className="anim-rise d-2 mx-5 mt-4 flex items-center gap-4 rounded-2xl border border-brand-500/25 bg-brand-500/8 p-4 transition hover:bg-brand-500/12"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-400">
          <HandCoins size={20} />
        </span>
        <span className="flex-1">
          <span className="block font-display text-[14px] font-semibold">
            Crédito pré-aprovado de <span className="tnum text-brand-400">R$ 50.000</span>
          </span>
          <span className="block text-[12px] text-white/50">Emissão de CCB 100% digital · a partir de 2,19% a.m.</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-brand-400" />
      </Link>

      {/* Serviços */}
      <section className="anim-rise d-3 mt-7 px-5">
        <h2 className="font-display text-[15px] font-semibold text-white/85">Serviços</h2>
        <div className="mt-3 grid grid-cols-5 gap-y-5">
          {services
            .filter((s) => !s.pj || profile === "pj")
            .map(({ to, icon: Icon, label }) => (
              <Link key={label} to={to} className="group flex flex-col items-center gap-1.5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/8 bg-white/5 text-white/80 transition group-hover:border-brand-500/40 group-hover:text-brand-400">
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <span className="text-center text-[10.5px] leading-tight text-white/55">{label}</span>
              </Link>
            ))}
        </div>
      </section>

      {/* Extrato */}
      <section className="anim-rise d-4 mt-8 px-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[15px] font-semibold text-white/85">Extrato</h2>
          <span className="text-[12px] font-medium text-brand-400">Últimos 7 dias</span>
        </div>
        <div className="mt-3 space-y-1">
          {txs.map((tx) => {
            const Icon = txIcon[tx.kind];
            const positive = tx.amount > 0;
            return (
              <div key={tx.id} className="flex items-center gap-3.5 rounded-2xl px-2 py-3 transition hover:bg-white/4">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                    positive ? "bg-positive/10 text-positive" : "bg-white/6 text-white/60"
                  }`}
                >
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{tx.title}</p>
                  <p className="truncate text-[12px] text-white/40">{tx.counterpart}</p>
                </div>
                <div className="text-right">
                  <p className={`tnum text-[14px] font-semibold ${positive ? "text-positive" : ""}`}>
                    {positive ? "+" : ""}{brl(tx.amount)}
                  </p>
                  <p className="text-[11px] text-white/35">{dateBR(tx.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  to, icon: Icon, label, primary,
}: { to: string; icon: React.ElementType; label: string; primary?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1.5 rounded-2xl py-3.5 text-[12px] font-semibold transition active:scale-95 ${
        primary
          ? "bg-brand-500 text-navy-950 shadow-[0_10px_24px_-10px_rgba(224,133,54,0.6)]"
          : "border border-white/10 bg-white/6 text-white/85 hover:bg-white/10"
      }`}
    >
      <Icon size={19} />
      {label}
    </Link>
  );
}
