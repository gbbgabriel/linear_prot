import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BankProvider } from "./context/BankContext";

import { Launcher } from "./pages/Launcher";
import { Onboarding } from "./pages/mobile/Onboarding";

// App do cliente (mobile-first)
import { MobileShell } from "./components/mobile/MobileShell";
import { Home } from "./pages/mobile/Home";
import { PixHome } from "./pages/mobile/pix/PixHome";
import { PixEnviar } from "./pages/mobile/pix/PixEnviar";
import { PixCopiaCola } from "./pages/mobile/pix/PixCopiaCola";
import { PixReceber } from "./pages/mobile/pix/PixReceber";
import { Transferir } from "./pages/mobile/Transferir";
import { Boleto } from "./pages/mobile/pagar/Boleto";
import { Lote } from "./pages/mobile/pagar/Lote";
import { Recarga } from "./pages/mobile/pagar/Recarga";
import { Saque } from "./pages/mobile/pagar/Saque";
import { Folha } from "./pages/mobile/pagar/Folha";
import { Credito } from "./pages/mobile/Credito";
import { Cartoes } from "./pages/mobile/Cartoes";
import { Perfil } from "./pages/mobile/Perfil";
import { ContaNominal } from "./pages/mobile/ContaNominal";

// Backoffice (desktop)
import { AdminShell } from "./pages/admin/AdminShell";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminClientes } from "./pages/admin/AdminClientes";
import { AdminCredito } from "./pages/admin/AdminCredito";
import { AdminRelatorios } from "./pages/admin/AdminRelatorios";

export default function App() {
  return (
    <BankProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Launcher />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* ── App do cliente ─────────────────────────── */}
          <Route path="/app" element={<MobileShell />}>
            <Route index element={<Home />} />
            <Route path="pix" element={<PixHome />} />
            <Route path="pix/enviar" element={<PixEnviar />} />
            <Route path="pix/copia-cola" element={<PixCopiaCola />} />
            <Route path="pix/receber" element={<PixReceber />} />
            <Route path="transferir" element={<Transferir />} />
            <Route path="pagar/boleto" element={<Boleto />} />
            <Route path="pagar/lote" element={<Lote />} />
            <Route path="pagar/recarga" element={<Recarga />} />
            <Route path="pagar/saque" element={<Saque />} />
            <Route path="pagar/folha" element={<Folha />} />
            <Route path="credito" element={<Credito />} />
            <Route path="cartoes" element={<Cartoes />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="nominal" element={<ContaNominal />} />
          </Route>

          {/* ── Backoffice ─────────────────────────────── */}
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="credito" element={<AdminCredito />} />
            <Route path="relatorios" element={<AdminRelatorios />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BankProvider>
  );
}
