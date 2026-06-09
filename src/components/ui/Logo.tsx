/** Wordmark LINEAR — traço fino geométrico, "E" de três barras como no logotipo oficial. */
export function Logo({
  size = 22,
  light = true,
  tagline = false,
}: {
  size?: number;
  light?: boolean;
  tagline?: boolean;
}) {
  const color = light ? "#fff" : "#062248";
  return (
    <span className="inline-flex flex-col items-start leading-none select-none">
      <span
        className="font-display font-light tracking-[0.42em]"
        style={{ fontSize: size, color }}
      >
        LIN
        <span className="relative inline-block w-[0.95em]">
          <span className="absolute left-0 top-[0.12em] h-[0.085em] w-[0.72em]" style={{ background: color }} />
          <span className="absolute left-0 top-[0.42em] h-[0.085em] w-[0.72em]" style={{ background: color }} />
          <span className="absolute left-0 top-[0.72em] h-[0.085em] w-[0.72em]" style={{ background: color }} />
          &nbsp;
        </span>
        AR
      </span>
      {tagline && (
        <span
          className="mt-1.5 font-display font-medium tracking-[0.5em] text-brand-500"
          style={{ fontSize: size * 0.34 }}
        >
          BANCO DIGITAL
        </span>
      )}
    </span>
  );
}
