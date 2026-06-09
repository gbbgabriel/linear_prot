import { useState } from "react";
import { Download } from "lucide-react";
import { AreaChart, BarRow } from "../../components/admin/Widgets";
import { brlCompact } from "../../lib/format";

/** Relatórios de volumetria — cash-in vs cash-out por trilho de pagamento. */

const periods = ["7 dias", "30 dias", "90 dias"] as const;

const volumetry: Record<(typeof periods)[number], { label: string; cashIn: number; cashOut: number }[]> = {
  "7 dias": [
    { label: "Pix", cashIn: 9_412_000, cashOut: 7_180_500 },
    { label: "TED", cashIn: 3_215_800, cashOut: 2_904_300 },
    { label: "Boletos", cashIn: 2_140_900, cashOut: 4_410_200 },
    { label: "P2P Linear", cashIn: 1_310_400, cashOut: 1_310_400 },
    { label: "Cartões", cashIn: 0, cashOut: 1_882_700 },
    { label: "Saque 24h", cashIn: 0, cashOut: 412_300 },
  ],
  "30 dias": [
    { label: "Pix", cashIn: 38_904_000, cashOut: 30_122_000 },
    { label: "TED", cashIn: 12_811_000, cashOut: 11_204_000 },
    { label: "Boletos", cashIn: 8_950_000, cashOut: 17_320_000 },
    { label: "P2P Linear", cashIn: 5_410_000, cashOut: 5_410_000 },
    { label: "Cartões", cashIn: 0, cashOut: 7_604_000 },
    { label: "Saque 24h", cashIn: 0, cashOut: 1_722_000 },
  ],
  "90 dias": [
    { label: "Pix", cashIn: 104_200_000, cashOut: 82_910_000 },
    { label: "TED", cashIn: 36_400_000, cashOut: 31_988_000 },
    { label: "Boletos", cashIn: 24_310_000, cashOut: 49_870_000 },
    { label: "P2P Linear", cashIn: 14_905_000, cashOut: 14_905_000 },
    { label: "Cartões", cashIn: 0, cashOut: 21_310_000 },
    { label: "Saque 24h", cashIn: 0, cashOut: 4_882_000 },
  ],
};

const inSeries = [220, 340, 290, 410, 380, 520, 480, 610, 590, 720, 680, 810, 790, 920];
const outSeries = [180, 260, 240, 330, 350, 410, 390, 480, 510, 560, 590, 640, 660, 730];

export function AdminRelatorios() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("7 dias");
  const rows = volumetry[period];
  const max = Math.max(...rows.flatMap((r) => [r.cashIn, r.cashOut]));
  const totalIn = rows.reduce((s, r) => s + r.cashIn, 0);
  const totalOut = rows.reduce((s, r) => s + r.cashOut, 0);

  return (
    <div className="anim-fadein">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-800">Relatórios de volumetria</h1>
          <p className="mt-1 text-[13.5px] text-navy-800/50">Cash-in e cash-out consolidados por trilho de pagamento.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-navy-800/10 bg-white p-1 text-[12.5px] font-semibold">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3.5 py-1.5 transition ${
                  period === p ? "bg-navy-800 text-white" : "text-navy-800/55 hover:bg-navy-800/5"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-[12.5px] font-bold text-navy-950 transition hover:bg-brand-400">
            <Download size={15} /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="anim-rise d-1 mt-6 grid gap-5 xl:grid-cols-5">
        {/* Curvas comparativas */}
        <div className="rounded-2xl border border-navy-800/8 bg-white p-6 xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[15px] font-bold text-navy-800">Evolução diária</h2>
            <div className="flex gap-4 text-[12px] text-navy-800/55">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-positive" /> Cash-in</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-negative" /> Cash-out</span>
            </div>
          </div>
          <div className="relative mt-5">
            <AreaChart data={inSeries} stroke="#2ec27e" />
            <div className="absolute inset-0">
              <AreaChart data={outSeries} stroke="#e0524f" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-navy-800/8 pt-5">
            <div>
              <p className="text-[11.5px] uppercase tracking-wider text-navy-800/40">Cash-in</p>
              <p className="tnum mt-1 font-display text-lg font-bold text-[#1a8a5c]">{brlCompact(totalIn)}</p>
            </div>
            <div>
              <p className="text-[11.5px] uppercase tracking-wider text-navy-800/40">Cash-out</p>
              <p className="tnum mt-1 font-display text-lg font-bold text-negative">{brlCompact(totalOut)}</p>
            </div>
            <div>
              <p className="text-[11.5px] uppercase tracking-wider text-navy-800/40">Net flow</p>
              <p className="tnum mt-1 font-display text-lg font-bold text-navy-800">{brlCompact(totalIn - totalOut)}</p>
            </div>
          </div>
        </div>

        {/* Por trilho */}
        <div className="rounded-2xl border border-navy-800/8 bg-white p-6 xl:col-span-2">
          <h2 className="font-display text-[15px] font-bold text-navy-800">Por modalidade · {period}</h2>
          <div className="mt-2 divide-y divide-navy-800/5">
            {rows.map((r) => (
              <BarRow key={r.label} {...r} max={max} format={brlCompact} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
