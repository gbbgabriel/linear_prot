import { useState } from "react";
import { Check, Filter, X } from "lucide-react";
import { LightBadge } from "../../components/admin/Widgets";

/** Esteira de clientes & KYC — aprovação manual dos cadastros vindos do onboarding. */

type KycStatus = "UNDER_REVIEW" | "APPROVED" | "REJECTED";

interface Client {
  id: string;
  name: string;
  doc: string;
  kind: "PF" | "PJ";
  occupation: string;
  pep: string;
  createdAt: string;
  status: KycStatus;
}

const seed: Client[] = [
  { id: "cli_8f2k1", name: "Mariana Costa Ribeiro", doc: "318.402.158-09", kind: "PF", occupation: "OCP0001 · Assalariada", pep: "NONE", createdAt: "09/06 14:21", status: "UNDER_REVIEW" },
  { id: "cli_2mc83", name: "Hexa Log LTDA", doc: "44.218.330/0001-09", kind: "PJ", occupation: "Logística", pep: "—", createdAt: "09/06 13:02", status: "UNDER_REVIEW" },
  { id: "cli_9l2wk", name: "Marcos Andrade Silveira", doc: "412.880.123-10", kind: "PF", occupation: "OCP0003 · Empresário", pep: "NONE", createdAt: "09/06 11:47", status: "APPROVED" },
  { id: "cli_7xp02", name: "Carlos Eduardo Santos", doc: "207.114.882-44", kind: "PF", occupation: "OCP0002 · Autônomo", pep: "RELATED", createdAt: "09/06 10:15", status: "UNDER_REVIEW" },
  { id: "cli_4nb55", name: "Barrueco Ventures LTDA", doc: "54.118.221/0001-22", kind: "PJ", occupation: "Holding", pep: "—", createdAt: "08/06 18:33", status: "APPROVED" },
  { id: "cli_1qa90", name: "Juliana Apolinário Reis", doc: "155.902.337-71", kind: "PF", occupation: "OCP0007 · Estudante", pep: "NONE", createdAt: "08/06 16:08", status: "REJECTED" },
  { id: "cli_6tt38", name: "João Pedro Almeida", doc: "388.115.490-02", kind: "PF", occupation: "OCP0006 · Prof. liberal", pep: "NONE", createdAt: "08/06 09:54", status: "APPROVED" },
];

const statusTone: Record<KycStatus, "warning" | "success" | "danger"> = {
  UNDER_REVIEW: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};
const statusLabel: Record<KycStatus, string> = {
  UNDER_REVIEW: "Em análise",
  APPROVED: "Aprovado",
  REJECTED: "Recusado",
};

export function AdminClientes() {
  const [clients, setClients] = useState(seed);
  const [filter, setFilter] = useState<"all" | KycStatus>("all");

  const list = clients.filter((c) => filter === "all" || c.status === filter);
  const pending = clients.filter((c) => c.status === "UNDER_REVIEW").length;

  const setStatus = (id: string, status: KycStatus) =>
    setClients((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));

  return (
    <div className="anim-fadein">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-800">Clientes & KYC</h1>
          <p className="mt-1 text-[13.5px] text-navy-800/50">
            {pending} cadastro{pending !== 1 ? "s" : ""} aguardando análise — payloads recebidos via{" "}
            <code className="rounded bg-navy-800/6 px-1.5 py-0.5 text-[12px] text-brand-700">registroDePessoaFisica</code>
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-navy-800/10 bg-white p-1 text-[12.5px] font-semibold">
          <Filter size={14} className="ml-2 text-navy-800/35" />
          {(
            [
              ["all", "Todos"],
              ["UNDER_REVIEW", "Em análise"],
              ["APPROVED", "Aprovados"],
              ["REJECTED", "Recusados"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-lg px-3 py-1.5 transition ${
                filter === k ? "bg-navy-800 text-white" : "text-navy-800/55 hover:bg-navy-800/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="anim-rise d-1 mt-6 overflow-hidden rounded-2xl border border-navy-800/8 bg-white">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-navy-800/8 bg-navy-800/3 text-[11.5px] uppercase tracking-wider text-navy-800/45">
              <th className="px-5 py-3.5 font-semibold">Cliente</th>
              <th className="px-5 py-3.5 font-semibold">Tipo</th>
              <th className="px-5 py-3.5 font-semibold">Ocupação</th>
              <th className="px-5 py-3.5 font-semibold">PEP</th>
              <th className="px-5 py-3.5 font-semibold">Cadastro</th>
              <th className="px-5 py-3.5 font-semibold">Status KYC</th>
              <th className="px-5 py-3.5 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-navy-800/5 transition last:border-0 hover:bg-navy-800/2">
                <td className="px-5 py-4">
                  <p className="font-semibold text-navy-800">{c.name}</p>
                  <p className="tnum text-[12px] text-navy-800/45">{c.doc} · {c.id}</p>
                </td>
                <td className="px-5 py-4">
                  <LightBadge tone={c.kind === "PF" ? "info" : "neutral"}>{c.kind}</LightBadge>
                </td>
                <td className="px-5 py-4 text-navy-800/65">{c.occupation}</td>
                <td className="px-5 py-4">
                  {c.pep === "RELATED" ? (
                    <LightBadge tone="warning">RELATED</LightBadge>
                  ) : (
                    <span className="text-navy-800/45">{c.pep}</span>
                  )}
                </td>
                <td className="tnum px-5 py-4 text-navy-800/55">{c.createdAt}</td>
                <td className="px-5 py-4">
                  <LightBadge tone={statusTone[c.status]}>{statusLabel[c.status]}</LightBadge>
                </td>
                <td className="px-5 py-4">
                  {c.status === "UNDER_REVIEW" ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setStatus(c.id, "APPROVED")}
                        className="flex items-center gap-1 rounded-lg bg-positive/10 px-3 py-1.5 text-[12px] font-bold text-[#1a8a5c] transition hover:bg-positive/20"
                      >
                        <Check size={13} /> Aprovar
                      </button>
                      <button
                        onClick={() => setStatus(c.id, "REJECTED")}
                        className="flex items-center gap-1 rounded-lg bg-negative/10 px-3 py-1.5 text-[12px] font-bold text-negative transition hover:bg-negative/20"
                      >
                        <X size={13} /> Recusar
                      </button>
                    </div>
                  ) : (
                    <p className="text-right text-[12px] text-navy-800/30">—</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <p className="p-10 text-center text-[13.5px] text-navy-800/40">Nenhum cliente neste filtro.</p>
        )}
      </div>
    </div>
  );
}
