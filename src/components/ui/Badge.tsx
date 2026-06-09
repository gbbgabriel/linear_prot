const tones = {
  success: "bg-positive/12 text-positive border-positive/25",
  warning: "bg-brand-500/12 text-brand-400 border-brand-500/25",
  danger: "bg-negative/12 text-negative border-negative/25",
  neutral: "bg-white/8 text-white/60 border-white/12",
  info: "bg-navy-500/20 text-navy-100 border-navy-500/30",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Mapeia status da API Hiperbanco para badge visual. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: keyof typeof tones; label: string }> = {
    APPROVED: { tone: "success", label: "Aprovado" },
    ACTIVE: { tone: "success", label: "Ativo" },
    DONE: { tone: "success", label: "Concluído" },
    SIGNED: { tone: "success", label: "Assinada" },
    SETTLED: { tone: "neutral", label: "Liquidada" },
    UNDER_REVIEW: { tone: "warning", label: "Em análise" },
    AWAITING_SIGNATURE: { tone: "warning", label: "Aguardando assinatura" },
    PROCESSING: { tone: "warning", label: "Processando" },
    SCHEDULED: { tone: "info", label: "Agendado" },
    PRODUCTION: { tone: "info", label: "Em produção" },
    PENDING: { tone: "warning", label: "Pendente" },
    REJECTED: { tone: "danger", label: "Recusado" },
    BLOCKED: { tone: "danger", label: "Bloqueado" },
  };
  const cfg = map[status] ?? { tone: "neutral" as const, label: status };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
