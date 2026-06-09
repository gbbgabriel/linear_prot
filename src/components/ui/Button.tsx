import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-navy-950 hover:bg-brand-400 active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(224,133,54,0.55)]",
  secondary:
    "bg-white/8 text-white hover:bg-white/14 border border-white/10 active:scale-[0.98]",
  outline:
    "border border-brand-500/60 text-brand-400 hover:bg-brand-500/10 active:scale-[0.98]",
  ghost: "text-white/70 hover:text-white hover:bg-white/6",
  danger: "bg-negative/15 text-negative border border-negative/30 hover:bg-negative/25",
};

export function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={`relative inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 font-display text-[15px] font-semibold transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none ${styles[variant]} ${className}`}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
