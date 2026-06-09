import { useState } from "react";
import { Banknote, MapPin } from "lucide-react";
import { FlowPage } from "../../../components/mobile/FlowPage";
import { Button } from "../../../components/ui/Button";
import { hiperbanco } from "../../../lib/hiperbanco";
import { useBank } from "../../../context/BankContext";
import { brl } from "../../../lib/format";

const VALUES = [50, 100, 200, 300, 500];

/** Saque na Rede 24h — gera token de saque sem cartão. */
export function Saque() {
  const { balance, applyTx } = useBank();
  const [amount, setAmount] = useState(100);
  const [token, setToken] = useState<{ token: string; expiresIn: string; fee: number } | null>(null);
  const [loading, setLoading] = useState(false);

  function submit() {
    setLoading(true);
    hiperbanco
      .saqueRede24h({ amount })
      .then(({ data }) => {
        applyTx({ kind: "saque", title: "Saque Rede 24h", counterpart: `Token ${data.token}`, amount: -(amount + data.fee) });
        setToken(data);
      })
      .finally(() => setLoading(false));
  }

  if (token) {
    return (
      <FlowPage title="Token de saque" subtitle="Use em qualquer caixa Banco24Horas">
        <div className="anim-rise flex flex-col items-center pt-6 text-center">
          <div className="anim-pop grid h-20 w-20 place-items-center rounded-full bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30">
            <Banknote size={34} />
          </div>
          <p className="mt-6 text-sm text-white/50">Digite este token no caixa eletrônico:</p>
          <p className="tnum mt-3 font-display text-[44px] font-bold tracking-[0.25em] text-brand-400">
            {token.token}
          </p>
          <p className="mt-2 text-[13px] text-white/45">
            Válido por {token.expiresIn} · Saque de <span className="tnum font-semibold text-white">{brl(amount)}</span>
          </p>
          <div className="mt-8 w-full rounded-2xl border border-white/8 bg-white/4 p-4 text-left text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-white/45">Tarifa Rede 24h</span>
              <span className="tnum font-medium">{brl(token.fee)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/45">Total debitado</span>
              <span className="tnum font-medium">{brl(amount + token.fee)}</span>
            </div>
          </div>
          <button className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-brand-400">
            <MapPin size={15} /> Encontrar caixa mais próximo
          </button>
        </div>
      </FlowPage>
    );
  }

  return (
    <FlowPage title="Saque Rede 24h" subtitle="Saque sem cartão com token">
      <div className="anim-rise flex h-full flex-col">
        <p className="text-[13px] font-medium text-white/55">Quanto você quer sacar?</p>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {VALUES.map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`tnum rounded-2xl border py-5 font-display text-[17px] font-bold transition ${
                amount === v
                  ? "border-brand-500 bg-brand-500/15 text-brand-400"
                  : "border-white/10 bg-white/4 text-white/60"
              }`}
            >
              R$ {v}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/40">
          Tarifa de R$ 6,90 por saque · Saldo disponível: <span className="tnum">{brl(balance)}</span>
        </p>
        <Button className="mt-auto w-full" loading={loading} onClick={submit} disabled={amount + 6.9 > balance}>
          {loading ? "Gerando token..." : "Gerar token de saque"}
        </Button>
      </div>
    </FlowPage>
  );
}
