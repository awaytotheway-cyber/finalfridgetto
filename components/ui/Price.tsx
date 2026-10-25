import { cn, formatPrice } from "@/lib/utils";

export function Price({
  amount,
  compareAt,
  className,
}: {
  amount: number;
  compareAt?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-medium text-charcoal">{formatPrice(amount)}</span>
      {compareAt && compareAt > amount && (
        <span className="text-[0.85em] text-stone line-through">
          <span className="sr-only">Was </span>
          {formatPrice(compareAt)}
        </span>
      )}
    </span>
  );
}
