import { cn } from "@/lib/utils";

/** Hand-drawn style sprig flanked by hairlines — a quiet section ornament. */
export function BotanicalDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-4 text-moss", className)}>
      <span className="h-px w-16 bg-current opacity-60" />
      <svg width="44" height="24" viewBox="0 0 44 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M4 12h36" />
        <path d="M14 12c0-4 3-7 7-8-1 4-3 7-7 8Z" />
        <path d="M14 12c0 4 3 7 7 8-1-4-3-7-7-8Z" />
        <path d="M26 12c0-3.5 2.5-6 6-7-.8 3.5-2.6 6-6 7Z" />
        <path d="M26 12c0 3.5 2.5 6 6 7-.8-3.5-2.6-6-6-7Z" />
        <circle cx="40" cy="12" r="1.4" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  );
}

/** Single leaf line drawing, used as a decorative accent. */
export function LeafSketch({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 160" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={className}>
      <path d="M60 155C60 110 58 60 62 8" />
      <path d="M61 40c-14-6-26-18-30-34 16 2 28 14 30 34Z" />
      <path d="M61 40c14-6 26-18 30-34-16 2-28 14-30 34Z" />
      <path d="M60 78c-18-6-32-20-38-40 20 4 34 18 38 40Z" />
      <path d="M60 78c18-6 32-20 38-40-20 4-34 18-38 40Z" />
      <path d="M60 116c-20-6-36-22-42-44 22 4 38 20 42 44Z" />
      <path d="M60 116c20-6 36-22 42-44-22 4-38 20-42 44Z" />
    </svg>
  );
}
