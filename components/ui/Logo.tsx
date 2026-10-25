import Link from "next/link";
import { cn } from "@/lib/utils";

/** Brand mark (leaf in a seal) + serif wordmark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className} fill="none">
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="15.5" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 2" />
      <path d="M20 30V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M20 19c-4-1-6.5-4-7-8 4 .5 6.5 3.5 7 8Z" fill="currentColor" />
      <path d="M20 24c4-1 6.5-4 7-8-4 .5-6.5 3.5-7 8Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, tone = "forest" }: { className?: string; tone?: "forest" | "cream" }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3",
        tone === "forest" ? "text-forest" : "text-cream",
        className,
      )}
      aria-label="Subhadra Agro Food Processing — home"
    >
      <LogoMark className="h-10 w-10 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:rotate-[20deg]" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.45rem] font-medium tracking-tight">Subhadra</span>
        <span className="mt-1 text-[0.58rem] font-medium uppercase tracking-[0.28em] opacity-75">
          Agro Food Processing
        </span>
      </span>
    </Link>
  );
}
