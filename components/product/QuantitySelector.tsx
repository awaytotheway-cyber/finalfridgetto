"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

/** − [n] + stepper with large tap targets and screen-reader labels. */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
  label = "Quantity",
  className,
}: QuantitySelectorProps) {
  const btn = cn(
    "grid place-items-center rounded-full text-forest transition-colors hover:bg-parchment disabled:opacity-35 disabled:hover:bg-transparent",
    size === "md" ? "h-11 w-11" : "h-9 w-9",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border border-line bg-cream", className)}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span aria-live="polite" className={cn("min-w-8 text-center font-medium tabular-nums", size === "sm" && "text-sm")}>
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
