import { Link } from "react-router-dom";
import {
  ArrowDownLeft, ArrowUpRight, Banknote, Barcode, ChevronRight, ClipboardPaste,
  KeyRound, Landmark, Layers, QrCode, Repeat, Smartphone, Users,
} from "lucide-react";
import { useBank } from "../../../context/BankContext";

/** Hub "Pix & Pagar" — agrega movimentação Pix, transferências e pagamentos. */

const pixActions = [
  { to: "/app/pix/enviar", icon: ArrowUpRight, t: "Enviar Pix", d: "Por chave: CPF, celular, e-mail ou aleatória" },
  { to: "/app/pix/copia-cola", icon: ClipboardPaste, t: "Pix Copia e Cola", d: "Cole o código de uma cobrança" },
  { to: "/app/pix/receber", icon: ArrowDownLeft, t: "Receber Pix", d: "QR Code de cash-in com ou sem valor" },
  { to: "/app/pix/receber", icon: QrCode, t: "Ler QR Code", d: "Pague escaneando um código" },
];

const otherActions = [
  { to: "/app/transferir", icon: Landmark, t: "TED", d: "Cash-out para outros bancos" },
  { to: "/app/transferir?tab=p2p", icon: Repeat, t: "P2P entre contas Linear", d: "Instantâneo e sem custo" },
  { to: "/app/pagar/boleto", icon: Barcode, t: "Pagar boleto ou consumo", d: "Código de barras ou linha digitável" },
  { to: "/app/pagar/lote", icon: Layers, t: "Pagamento em lote", d: "Vários boletos de uma vez", pj: true },
  { to: "/app/pagar/recarga", icon: Smartphone, t: "Recarga de celular e serviços", d: "Todas as operadoras" },
  { to: "/app/pagar/saque", icon: Banknote, t: "Saque na Rede 24h", d: "Token para qualquer caixa Banco24Horas" },
  { to: "/app/pagar/folha", icon: Users, t: "Folha de pagamento", d: "Pague colaboradores em um clique", pj: true },
];

export function PixHome() {
  const { user, profile } = useBank();
  return (
    <div className="anim-fadein px-5 pt-8">
      <h1 className="font-display text-2xl font-semibold">Pix & Pagamentos</h1>
      <p className="mt-1 text-sm text-white/50">Área de movimentação da sua conta.</p>

      <div className="anim-rise d-1 mt-6 grid grid-cols-2 gap-3">
        {pixActions.map(({ to, icon: Icon, t }) => (
          <Link
            key={t}
            to={to}
            className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-4 transition hover:border-brand-500/40"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
              <Icon size={19} />
            </span>
            <p className="mt-3 font-display text-[14px] font-semibold leading-tight">{t}</p>
          </Link>
        ))}
      </div>

      {/* Chave cadastrada */}
      <div className="anim-rise d-2 mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
        <KeyRound size={18} className="shrink-0 text-brand-400" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium">Minha chave Pix</p>
          <p className="truncate font-mono text-[12px] text-white/45">{user.cpf} · CPF</p>
        </div>
        <button className="text-[12px] font-semibold text-brand-400">Gerenciar</button>
      </div>

      <h2 className="anim-rise d-3 mt-8 font-display text-[15px] font-semibold text-white/85">
        Transferências e pagamentos
      </h2>
      <div className="anim-rise d-4 mt-3 overflow-hidden rounded-2xl border border-white/8 bg-white/3">
        {otherActions
          .filter((a) => !a.pj || profile === "pj")
          .map(({ to, icon: Icon, t, d }, i, arr) => (
            <Link
              key={t}
              to={to}
              className={`flex items-center gap-4 px-4 py-4 transition hover:bg-white/5 ${
                i < arr.length - 1 ? "border-b border-white/6" : ""
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/6 text-white/70">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium">{t}</span>
                <span className="block truncate text-[12px] text-white/40">{d}</span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-white/25" />
            </Link>
          ))}
      </div>
    </div>
  );
}
