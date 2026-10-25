"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Category, CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  active?: CategorySlug;
  counts: Record<string, number>;
}

/**
 * Category pills. Each is a real link (?category=…) so filters are
 * shareable, work without JS, and the back button behaves as expected.
 */
export function CategoryFilter({ categories, active, counts }: CategoryFilterProps) {
  const options = [{ slug: undefined, name: "All" }, ...categories];
  return (
    <nav aria-label="Filter by category" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {options.map((c) => {
          const isActive = c.slug === active;
          const href = c.slug ? `/shop?category=${c.slug}` : "/shop";
          return (
            <li key={c.name}>
              <Link
                href={href}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm transition-colors duration-300",
                  isActive
                    ? "border-forest text-cream"
                    : "border-line text-charcoal hover:border-forest/40 hover:text-forest",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-full bg-forest"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{c.name}</span>
                <span className={cn("relative text-xs", isActive ? "text-cream/70" : "text-stone")}>
                  {counts[c.slug ?? "all"]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
