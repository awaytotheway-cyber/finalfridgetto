import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-cream/90 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-forest backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
