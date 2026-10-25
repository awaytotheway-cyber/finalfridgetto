import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container-page py-24 md:py-32">
      <Reveal className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          align="left"
          eyebrow="Most loved"
          title={
            <>
              Kitchen staples, <em className="text-sage">the honest way</em>
            </>
          }
          description="Our customers' favourites. A good place to begin if you're new here."
        />
        <Link
          href="/shop"
          className="group inline-flex shrink-0 items-center gap-2 border-b border-forest/30 pb-1 text-forest transition-colors hover:border-terracotta hover:text-terracotta"
        >
          View all products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
      <ProductGrid products={products} />
    </section>
  );
}
