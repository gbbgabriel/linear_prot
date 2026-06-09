import { ArrowDownLeft, ArrowUpRight, FileSignature, Users, Wallet } from "lucide-react";
import { AreaChart, StatCard, LightBadge } from "../../components/admin/Widgets";
import { brl } from "../../lib/format";

const tpv = [310, 420, 380, 520, 610, 540, 720, 690, 810, 920, 880, 1040, 990, 1180];

const feed = [
  { t: "KYC aprovado", d: "Mariana Costa Ribeiro · PF", tone: "success" as const, when: "há 2 min" },
  { t: "CCB emitida", d: "CCB-2026-31482 · R$ 32.000 · 36x", tone: "warning" as const, when: "há 9 min" },
  { t: "Pix cash-in", d: "Barrueco Ventures LTDA · R$ 18.500,00", tone: "info" as const, when: "há 14 min" },
  { t: "Folha executada", d: "Hexa Log LTDA · 42 colaboradores", tone: "info" as const, when: "há 31 min" },
  { t: "KYC reprovado", d: "Documento ilegível · reenvio solicitado", tone: "danger" as const, when: "há 48 min" },
];

export function AdminDashboard() {
  return (
    <div className="anim-fadein">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-800">Visão geral</h1>
          <p className="mt-1 text-[13.5px] text-navy-800/50">Operação Linear · terça-feira, 9 de junho de 2026</p>
        </div>
        <span className="text-[12px] text-navy-800/40">Atualizado em tempo real via webhooks Hiperbanco</span>
      </div>

      <div className="anim-rise d-1 mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Users} label="Clientes ativos" value="12.847" delta="8,2% no mês" deltaUp />
        <StatCard icon={Wallet} label="TPV do mês" value="R$ 48,2M" delta="12,4%" deltaUp />
        <StatCard icon={FileSignature} label="CCBs ativas" value="R$ 6,8M" delta="23 novas hoje" deltaUp />
        <StatCard icon={Users} label="KYC pendentes" value="37" delta="precisa de ação" deltaUp={false} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {/* TPV chart */}
        <div className="anim-rise d-2 rounded-2xl border border-navy-800/8 bg-white p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[15px] font-bold text-navy-800">Volumetria diária (TPV)</h2>
              <p className="text-[12.5px] text-navy-800/45">Últimos 14 dias · todas as modalidades</p>
            </div>
            <div className="flex gap-4 text-[12px]">
              <span className="flex items-center gap-1.5 text-navy-800/55">
                <span className="h-2 w-2 rounded-full bg-brand-500" /> Cash-in + Cash-out
              </span>
            </div>
          </div>
          <div className="mt-5">
            <AreaChart data={tpv} />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-navy-800/35">
            <span>27 mai</span><span>2 jun</span><span>9 jun</span>
          </div>
        </div>

        {/* Atividade */}
        <div className="anim-rise d-3 rounded-2xl border border-navy-800/8 bg-white p-6">
          <h2 className="font-display text-[15px] font-bold text-navy-800">Atividade recente</h2>
          <div className="mt-4 space-y-4">
            {feed.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  { success: "bg-positive", warning: "bg-brand-500", danger: "bg-negative", info: "bg-navy-500" }[f.tone]
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-navy-800">{f.t}</p>
                  <p className="truncate text-[12.5px] text-navy-800/50">{f.d}</p>
                </div>
                <span className="shrink-0 text-[11px] text-navy-800/35">{f.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo cash-in/out do dia */}
      <div className="anim-rise d-4 mt-5 grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-navy-800/8 bg-white p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-positive/10 text-positive">
            <ArrowDownLeft size={20} />
          </span>
          <div className="flex-1">
            <p className="text-[12.5px] text-navy-800/50">Cash-in hoje</p>
            <p className="tnum font-display text-xl font-bold text-navy-800">{brl(2_412_380.44)}</p>
          </div>
          <LightBadge tone="success">1.284 transações</LightBadge>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-navy-800/8 bg-white p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-negative/10 text-negative">
            <ArrowUpRight size={20} />
          </span>
          <div className="flex-1">
            <p className="text-[12.5px] text-navy-800/50">Cash-out hoje</p>
            <p className="tnum font-display text-xl font-bold text-navy-800">{brl(1_877_905.12)}</p>
          </div>
          <LightBadge tone="danger">982 transações</LightBadge>
        </div>
      </div>
    </div>
  );
}
