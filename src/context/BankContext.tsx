import { createContext, useCallback, useContext, useMemo, useState } from "react";

/** Estado global simulando o backend da conta (respostas da API Hiperbanco já hidratadas). */

export type ProfileKind = "pf" | "pj";

export interface Tx {
  id: string;
  kind:
    | "pix_in"
    | "pix_out"
    | "ted_in"
    | "ted_out"
    | "p2p_in"
    | "p2p_out"
    | "boleto"
    | "recarga"
    | "saque"
    | "folha"
    | "ccb_in"
    | "cartao";
  title: string;
  counterpart: string;
  amount: number; // negativo = débito
  date: string; // ISO
}

export interface Ccb {
  id: string;
  number: string;
  amount: number;
  installments: number;
  installmentValue: number;
  status: "AWAITING_SIGNATURE" | "SIGNED" | "ACTIVE" | "SETTLED";
  createdAt: string;
}

export interface Card {
  id: string;
  type: "VIRTUAL" | "PHYSICAL";
  last4: string;
  printedName: string;
  status: "ACTIVE" | "BLOCKED" | "PRODUCTION";
}

interface ProfileState {
  balance: number;
  txs: Tx[];
}

const now = Date.now();
const iso = (daysAgo: number, h = 10) =>
  new Date(now - daysAgo * 864e5 - h * 36e5).toISOString();

const seedPF: ProfileState = {
  balance: 12847.93,
  txs: [
    { id: "t1", kind: "pix_in", title: "Pix recebido", counterpart: "Mariana Costa Ribeiro", amount: 1250, date: iso(0, 2) },
    { id: "t2", kind: "boleto", title: "Boleto pago", counterpart: "Enel Distribuição SP", amount: -218.46, date: iso(0, 6) },
    { id: "t3", kind: "pix_out", title: "Pix enviado", counterpart: "João Pedro Almeida", amount: -89.9, date: iso(1) },
    { id: "t4", kind: "cartao", title: "Cartão virtual", counterpart: "Spotify Brasil", amount: -34.9, date: iso(2) },
    { id: "t5", kind: "ted_in", title: "TED recebida", counterpart: "Tech Solutions LTDA", amount: 4800, date: iso(3) },
    { id: "t6", kind: "recarga", title: "Recarga de celular", counterpart: "Vivo · (11) 98•••-••42", amount: -50, date: iso(4) },
    { id: "t7", kind: "pix_out", title: "Pix enviado", counterpart: "Restaurante Itacoa", amount: -156.8, date: iso(5) },
    { id: "t8", kind: "saque", title: "Saque Rede 24h", counterpart: "Banco24Horas — Paulista", amount: -300, date: iso(6) },
  ],
};

const seedPJ: ProfileState = {
  balance: 184320.55,
  txs: [
    { id: "j1", kind: "pix_in", title: "Pix recebido", counterpart: "Cliente — NF 2241", amount: 18500, date: iso(0, 3) },
    { id: "j2", kind: "folha", title: "Folha de pagamento", counterpart: "12 colaboradores", amount: -64230.18, date: iso(1) },
    { id: "j3", kind: "boleto", title: "Boleto pago", counterpart: "Fornecedor Atlas Embalagens", amount: -7420, date: iso(2) },
    { id: "j4", kind: "ted_in", title: "TED recebida", counterpart: "Marketplace Repasse", amount: 52110.4, date: iso(3) },
    { id: "j5", kind: "p2p_out", title: "P2P enviado", counterpart: "Conta Linear — Filial 02", amount: -12000, date: iso(4) },
  ],
};

interface BankCtx {
  profile: ProfileKind;
  setProfile: (p: ProfileKind) => void;
  user: { name: string; firstName: string; cpf: string; idClient: string; account: string; branch: string };
  company: { name: string; cnpj: string; account: string };
  balance: number;
  txs: Tx[];
  applyTx: (tx: Omit<Tx, "id" | "date">) => void;
  ccbs: Ccb[];
  addCcb: (c: Ccb) => void;
  signCcb: (id: string) => void;
  cards: Card[];
  addCard: (c: Card) => void;
  toggleCardBlock: (id: string) => void;
}

const Ctx = createContext<BankCtx | null>(null);

export function BankProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileKind>("pf");
  const [accounts, setAccounts] = useState<Record<ProfileKind, ProfileState>>({
    pf: seedPF,
    pj: seedPJ,
  });
  const [ccbs, setCcbs] = useState<Ccb[]>([
    {
      id: "ccb_seed1",
      number: "CCB-2026-18342",
      amount: 15000,
      installments: 24,
      installmentValue: 791.42,
      status: "ACTIVE",
      createdAt: iso(94),
    },
  ]);
  const [cards, setCards] = useState<Card[]>([
    { id: "card_seed1", type: "PHYSICAL", last4: "4421", printedName: "MARCOS A SILVEIRA", status: "ACTIVE" },
    { id: "card_seed2", type: "VIRTUAL", last4: "8810", printedName: "MARCOS A SILVEIRA", status: "ACTIVE" },
  ]);

  const applyTx = useCallback(
    (tx: Omit<Tx, "id" | "date">) => {
      setAccounts((prev) => {
        const cur = prev[profile];
        return {
          ...prev,
          [profile]: {
            balance: Math.round((cur.balance + tx.amount) * 100) / 100,
            txs: [
              { ...tx, id: `tx_${Date.now()}`, date: new Date().toISOString() },
              ...cur.txs,
            ],
          },
        };
      });
    },
    [profile],
  );

  const addCcb = useCallback((c: Ccb) => setCcbs((p) => [c, ...p]), []);
  const signCcb = useCallback(
    (id: string) =>
      setCcbs((p) => p.map((c) => (c.id === id ? { ...c, status: "ACTIVE" } : c))),
    [],
  );
  const addCard = useCallback((c: Card) => setCards((p) => [c, ...p]), []);
  const toggleCardBlock = useCallback(
    (id: string) =>
      setCards((p) =>
        p.map((c) =>
          c.id === id
            ? { ...c, status: c.status === "BLOCKED" ? "ACTIVE" : "BLOCKED" }
            : c,
        ),
      ),
    [],
  );

  const value = useMemo<BankCtx>(
    () => ({
      profile,
      setProfile,
      user: {
        name: "Marcos Andrade Silveira",
        firstName: "Marcos",
        cpf: "412.•••.•••-10",
        idClient: "cli_9l2wk17m2aoju53",
        account: "7203481-0",
        branch: "0001",
      },
      company: { name: "Barrueco Ventures LTDA", cnpj: "54.118.•••/0001-22", account: "8810244-5" },
      balance: accounts[profile].balance,
      txs: accounts[profile].txs,
      applyTx,
      ccbs,
      addCcb,
      signCcb,
      cards,
      addCard,
      toggleCardBlock,
    }),
    [profile, accounts, applyTx, ccbs, addCcb, signCcb, cards, addCard, toggleCardBlock],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBank() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBank deve ser usado dentro de <BankProvider>");
  return ctx;
}
