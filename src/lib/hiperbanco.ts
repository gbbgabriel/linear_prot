/**
 * Mock do SDK `@api/hiperbanco` (https://docs.hiperbanco.com.br).
 *
 * Reproduz a assinatura dos métodos da API FullBanking — cada chamada
 * devolve uma Promise com `{ data }` após latência simulada, permitindo
 * trocar pelo SDK real sem alterar as telas.
 */

const latency = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const id = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const e2e = () =>
  `E18236120${Date.now()}${Math.floor(Math.random() * 1e4)}`.slice(0, 32);

export interface RegistroPF {
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  documentType: "RG" | "CNH" | "RNE";
  occupation: string; // código OCPxxxx
  pep: "NONE" | "SELF" | "RELATED";
  nationality: "BRASILEIRO" | "ESTRANGEIRO";
  relationshipStatus:
    | "SOLTEIRO"
    | "CASADO"
    | "DIVORCIADO"
    | "VIUVO"
    | "UNIAO_ESTAVEL";
  education:
    | "NAO_ALFABETIZADO"
    | "FUNDAMENTAL"
    | "MEDIO"
    | "SUPERIOR"
    | "POS_GRADUACAO";
}

export const OCCUPATIONS = [
  { code: "OCP0001", label: "Assalariado(a)" },
  { code: "OCP0002", label: "Autônomo(a)" },
  { code: "OCP0003", label: "Empresário(a)" },
  { code: "OCP0004", label: "Servidor(a) público(a)" },
  { code: "OCP0005", label: "Aposentado(a) / Pensionista" },
  { code: "OCP0006", label: "Profissional liberal" },
  { code: "OCP0007", label: "Estudante" },
] as const;

export const hiperbanco = {
  /** POST /v1/clients/pf — onboarding de Pessoa Física */
  async registroDePessoaFisica(payload: RegistroPF, opts?: { idClient?: string }) {
    await latency(1100);
    return {
      data: {
        idClient: opts?.idClient ?? id("cli"),
        status: "UNDER_REVIEW",
        kycScore: 0.94,
        account: { branch: "0001", number: `${Math.floor(Math.random() * 9e6 + 1e6)}-0` },
        ...payload,
      },
    };
  },

  /** POST /v1/clients/pj */
  async registroDePessoaJuridica(payload: Record<string, string>) {
    await latency(1100);
    return { data: { idClient: id("cli"), status: "UNDER_REVIEW", ...payload } };
  },

  /** GET /v1/pix/keys/{key} — consulta de chave (DICT) */
  async consultarChavePix(key: string) {
    await latency(650);
    const banks = ["Nubank", "Itaú Unibanco", "Banco do Brasil", "Inter", "C6 Bank"];
    const names = ["Mariana Costa Ribeiro", "João Pedro Almeida", "Tech Solutions LTDA", "Carlos Eduardo Santos"];
    return {
      data: {
        key,
        ownerName: names[key.length % names.length],
        ownerDocument: `***.${String(key.length).padStart(3, "4")}.***-**`,
        bank: banks[key.length % banks.length],
        ispb: "18236120",
      },
    };
  },

  /** POST /v1/pix/cash-out */
  async pixCashOut(p: { key: string; amount: number; description?: string }) {
    await latency(900);
    return { data: { endToEndId: e2e(), status: "DONE", ...p, settledAt: new Date().toISOString() } };
  },

  /** POST /v1/pix/qrcodes — Pix Cash-in (cobrança) */
  async pixGerarQrCode(p: { amount?: number; description?: string }) {
    await latency(700);
    return {
      data: {
        txId: id("tx"),
        emv: `00020126580014br.gov.bcb.pix0136${id("key")}-linear52040000530398654${(p.amount ?? 0).toFixed(2)}5802BR5913LINEAR S.A.6009SAO PAULO`,
        ...p,
      },
    };
  },

  /** POST /v1/pix/copy-paste/decode */
  async decodificarCopiaECola(emv: string) {
    await latency(750);
    return {
      data: {
        emv,
        receiverName: "Eletropaulo Distribuição S.A.",
        receiverDocument: "61.695.227/0001-93",
        amount: 234.18,
        description: "Fatura de energia — Jun/2026",
      },
    };
  },

  /** POST /v1/ted/cash-out */
  async tedCashOut(p: { bankCode: string; branch: string; account: string; document: string; name: string; amount: number }) {
    await latency(1000);
    return { data: { transactionId: id("ted"), status: "PROCESSING", eta: "Até 1 dia útil", ...p } };
  },

  /** POST /v1/p2p — transferência entre contas Linear */
  async p2pTransfer(p: { account: string; amount: number; description?: string }) {
    await latency(600);
    return { data: { transactionId: id("p2p"), status: "DONE", ...p } };
  },

  /** POST /v1/billpayments — pagamento de contas/boletos */
  async pagarConta(barcode: string) {
    await latency(850);
    return {
      data: {
        transactionId: id("bill"),
        barcode,
        beneficiary: "Companhia de Saneamento Básico — SABESP",
        amount: 187.42,
        dueDate: "2026-06-15",
        discount: 0,
        status: "SCHEDULED",
      },
    };
  },

  /** POST /v1/billpayments/batch — pagamento em lote */
  async pagamentoEmLote(items: { beneficiary: string; amount: number }[]) {
    await latency(1400);
    return {
      data: {
        batchId: id("batch"),
        total: items.reduce((s, i) => s + i.amount, 0),
        count: items.length,
        status: "PROCESSING",
      },
    };
  },

  /** POST /v1/ccb/simulate — simulação de Cédula de Crédito Bancário */
  async simularCCB(p: { amount: number; installments: number }) {
    await latency(800);
    const monthlyRate = 0.0219; // 2,19% a.m.
    const iof = p.amount * 0.0038 + p.amount * 0.000082 * p.installments * 30;
    const i = monthlyRate;
    const pmt = (p.amount * i) / (1 - Math.pow(1 + i, -p.installments));
    return {
      data: {
        simulationId: id("sim"),
        amount: p.amount,
        installments: p.installments,
        monthlyRate,
        cetYearly: 0.3274,
        iof: Math.round(iof * 100) / 100,
        installmentValue: Math.round(pmt * 100) / 100,
        totalAmount: Math.round(pmt * p.installments * 100) / 100,
        firstDueDate: new Date(Date.now() + 32 * 864e5).toISOString(),
      },
    };
  },

  /** POST /v1/ccb — emissão da CCB */
  async emitirCCB(p: { simulationId: string; amount: number; installments: number }) {
    await latency(1300);
    return {
      data: {
        ccbId: id("ccb"),
        ccbNumber: `CCB-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
        status: "AWAITING_SIGNATURE",
        ...p,
      },
    };
  },

  /** POST /v1/ccb/{id}/sign — assinatura digital (ICP-Brasil simulada) */
  async assinarCCB(ccbId: string, p: { signerDocument: string; otp: string }) {
    await latency(1200);
    return {
      data: {
        ccbId,
        status: "SIGNED",
        signedAt: new Date().toISOString(),
        signatureHash: `sha256:${id("sig")}${id("sig")}`,
        disbursement: { eta: "Em até 10 minutos", method: "PIX" },
      },
    };
  },

  /** POST /v1/cards — emissão de cartão virtual ou físico */
  async emitirCartao(p: { type: "VIRTUAL" | "PHYSICAL"; printedName: string }) {
    await latency(1000);
    return {
      data: {
        cardId: id("card"),
        last4: String(Math.floor(Math.random() * 9000 + 1000)),
        brand: "Mastercard",
        status: p.type === "VIRTUAL" ? "ACTIVE" : "PRODUCTION",
        ...p,
      },
    };
  },

  /** POST /v1/topups — recarga de celular e serviços */
  async recarga(p: { carrier: string; phone: string; amount: number }) {
    await latency(800);
    return { data: { transactionId: id("topup"), status: "DONE", ...p } };
  },

  /** POST /v1/withdrawals — saque na Rede 24h */
  async saqueRede24h(p: { amount: number }) {
    await latency(900);
    return {
      data: {
        withdrawalId: id("wdr"),
        token: String(Math.floor(Math.random() * 9e5 + 1e5)),
        expiresIn: "30 minutos",
        fee: 6.9,
        ...p,
      },
    };
  },

  /** POST /v1/payroll — folha de pagamento */
  async folhaDePagamento(items: { name: string; amount: number }[]) {
    await latency(1500);
    return {
      data: {
        payrollId: id("pay"),
        employees: items.length,
        total: items.reduce((s, i) => s + i.amount, 0),
        status: "SCHEDULED",
        executionDate: new Date(Date.now() + 864e5).toISOString(),
      },
    };
  },

  /** POST /v1/nominal-accounts — conta nominal (escrow) */
  async criarContaNominal(p: { purpose: string; holderName: string }) {
    await latency(1000);
    return {
      data: {
        accountId: id("nom"),
        branch: "0001",
        number: `${Math.floor(Math.random() * 9e6 + 1e6)}-7`,
        status: "ACTIVE",
        ...p,
      },
    };
  },
};
