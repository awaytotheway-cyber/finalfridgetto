import Image from "next/image";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Category } from "@/lib/types";
import { unsplash } from "@/lib/utils";

const TILE_IMAGES: Record<string, string> = {
  "oils-ghee": "1573812461383-e5f8b759d12e",
  spices: "1768729340164-7d83fe18384d",
  sweeteners: "1613548058193-1cd24c1bebcf",
  "herbal-wellness": "1701520839071-55bdfe64c5ed",
};

export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-parchment/50 py-24 md:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Shop by category" title="Four shelves, one promise" className="mb-14" />
        <RevealGroup className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {categories.map((c) => (
            <RevealItem key={c.slug}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-forest"
              >
                <Image
                  src={unsplash(TILE_IMAGES[c.slug], 800)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-90 transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3 className="text-2xl text-cream md:text-3xl">{c.name}</h3>
                  <p className="mt-1 hidden text-sm text-cream/80 sm:block">{c.description}</p>
                  <span className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-cream/90 underline-offset-4 group-hover:underline">
                    Explore →
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
