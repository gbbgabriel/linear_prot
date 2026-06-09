interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

/** Wrapper de campo com label padrão do design system. */
export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium tracking-wide text-white/55">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-white/35">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full h-12 rounded-xl bg-white/6 border border-white/10 px-4 text-[15px] text-white placeholder:text-white/25 outline-none transition-colors focus:border-brand-500/70 focus:bg-white/8";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23ffffff66' stroke-width='2'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10 [&>option]:bg-navy-900 ${props.className ?? ""}`}
    />
  );
}
