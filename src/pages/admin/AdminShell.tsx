import { NavLink, Outlet, Link } from "react-router-dom";
import { BarChart3, FileSignature, LayoutDashboard, LogOut, Search, Settings, Users } from "lucide-react";
import { Logo } from "../../components/ui/Logo";

const nav = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/admin/clientes", label: "Clientes & KYC", icon: Users },
  { to: "/admin/credito", label: "Crédito · CCB", icon: FileSignature },
  { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
];

/** Shell do Backoffice — layout desktop com sidebar navy e conteúdo claro. */
export function AdminShell() {
  return (
    <div className="flex min-h-dvh bg-[#f3f5f8] text-navy-800">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-gradient-to-b from-navy-800 to-navy-950 px-4 py-6">
        <Link to="/" className="px-2">
          <Logo size={15} />
          <span className="mt-1 block text-[9px] font-bold tracking-[0.35em] text-brand-500">BACKOFFICE</span>
        </Link>

        <nav className="mt-9 flex flex-1 flex-col gap-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all ${
                  isActive
                    ? "bg-brand-500 text-navy-950 shadow-[0_8px_20px_-8px_rgba(224,133,54,0.6)]"
                    : "text-white/55 hover:bg-white/8 hover:text-white"
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
          <button className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-white/55 transition hover:bg-white/8 hover:text-white">
            <Settings size={17} /> Configurações
          </button>
        </nav>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <p className="text-[11px] text-white/45">Conectado à API</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-white">
            <span className="h-1.5 w-1.5 animate-[pulse-soft_2s_infinite] rounded-full bg-positive" />
            Hiperbanco · produção
          </p>
        </div>

        <Link to="/" className="mt-3 flex items-center gap-2 px-2 text-[12.5px] font-medium text-white/40 transition hover:text-white">
          <LogOut size={15} /> Sair
        </Link>
      </aside>

      {/* Conteúdo */}
      <div className="ml-60 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-800/8 bg-white/80 px-8 backdrop-blur-xl">
          <div className="flex h-9 w-72 items-center gap-2 rounded-lg bg-navy-800/5 px-3 text-navy-800/40">
            <Search size={15} />
            <span className="text-[13px]">Buscar cliente, CCB, transação…</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-positive/10 px-3 py-1 text-[11px] font-bold tracking-wide text-positive">
              AMBIENTE DEMO
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-800 font-display text-[12px] font-bold text-white">
              OP
            </span>
          </div>
        </header>
        <main className="px-8 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
