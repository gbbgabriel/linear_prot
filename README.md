# Linear · Banco Digital — Protótipo

Protótipo funcional de banco digital white-label integrado (simulado) à **API BaaS / Credit-as-a-Service do Hiperbanco**, incluindo emissão de **CCB** com assinatura digital.

## Rodando

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`:

| Rota | Interface |
| --- | --- |
| `/` | Gateway do protótipo (escolha de interface) |
| `/onboarding` | Onboarding & KYC (payload `registroDePessoaFisica`) |
| `/app` | App do cliente — mobile-first (máx. 450px) |
| `/admin` | Backoffice — desktop com sidebar |

## Estrutura

```
src/
├── lib/
│   ├── hiperbanco.ts      # Mock do SDK @api/hiperbanco (todas as Promises .then/.catch)
│   └── format.ts          # BRL, máscaras CPF/CNPJ/telefone/data
├── context/
│   └── BankContext.tsx    # Perfis PF/PJ, saldo, extrato, CCBs e cartões
├── components/
│   ├── ui/                # Button, Field, Badge, Logo (design system)
│   ├── mobile/            # Shell, BottomNav, FlowPage, SuccessScreen, AmountInput
│   └── admin/             # StatCard, AreaChart, BarRow (SVG puro, sem libs)
└── pages/
    ├── Launcher.tsx       # Gateway
    ├── mobile/            # Home, Pix (enviar/receber/copia-cola), TED+P2P,
    │                      # Boleto, Lote, Recarga, Saque 24h, Folha, Crédito CCB,
    │                      # Cartões, Perfil, Conta Nominal, Onboarding
    └── admin/             # Dashboard, Clientes & KYC, Crédito CCB, Relatórios
```

## Funcionalidades mapeadas da API Hiperbanco

- **Onboarding & KYC** — campos exatos: `documentType`, `occupation` (OCPxxxx), `pep`, `nationality`, `relationshipStatus`, `education`, `idClient`
- **Conta Digital PF e PJ** — saldo, extrato e troca de perfil no header
- **Pix** — cash-out por chave (consulta DICT), Copia e Cola, QR Code de cash-in
- **TED** e **P2P** entre contas Linear
- **Pagamentos** — boletos, contas de consumo e pagamento em lote (PJ)
- **Crédito & CCB** — simulação (Tabela Price + IOF + CET), emissão e assinatura digital com OTP
- **Cartões** — emissão virtual/físico, bloqueio, tracking de produção
- **Serviços** — recargas, Saque Rede 24h (token), folha de pagamento, conta nominal (escrow)

> Para plugar a API real: substituir `src/lib/hiperbanco.ts` pelo SDK
> `npx api install "@hiperbanco/v1.0#..."` — as telas já consomem `{ data }` via `.then()`.

Paleta: navy `#062248` · laranja `#E08536` · tipografia Sora + Instrument Sans.
