import { NavLink } from "react-router-dom";
import { Home, QrCode, HandCoins, CreditCard, UserRound } from "lucide-react";

const items = [
  { to: "/app", label: "Início", icon: Home, end: true },
  { to: "/app/pix", label: "Pix & Pagar", icon: QrCode },
  { to: "/app/credito", label: "Crédito", icon: HandCoins },
  { to: "/app/cartoes", label: "Cartões", icon: CreditCard },
  { to: "/app/perfil", label: "Perfil", icon: UserRound },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[450px] -translate-x-1/2 border-t border-white/8 bg-navy-900/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                isActive ? "text-brand-400" : "text-white/40 hover:text-white/70"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`grid h-7 w-12 place-items-center rounded-full transition-all ${isActive ? "bg-brand-500/15" : ""}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
