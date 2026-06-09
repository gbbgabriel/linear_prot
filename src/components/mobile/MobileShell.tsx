import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

/** Shell do app do cliente: viewport mobile centralizado (máx. 450px) com nav inferior. */
export function MobileShell() {
  const { pathname } = useLocation();
  // Esconde a nav em sub-fluxos (telas de transação ocupam tudo)
  const isRoot = ["/app", "/app/pix", "/app/credito", "/app/cartoes", "/app/perfil"].includes(
    pathname,
  );

  return (
    <div className="flex min-h-dvh justify-center bg-navy-950">
      {/* Moldura desktop: glow ambiente atrás do device */}
      <div className="pointer-events-none fixed inset-0 hidden lg:block">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-navy-800/40 blur-[160px]" />
        <div className="absolute left-1/2 bottom-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[140px]" />
      </div>

      <div className="noise relative flex min-h-dvh w-full max-w-[450px] flex-col bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        <main className={`flex-1 ${isRoot ? "pb-24" : "pb-6"}`}>
          <Outlet />
        </main>
        {isRoot && <BottomNav />}
      </div>
    </div>
  );
}
