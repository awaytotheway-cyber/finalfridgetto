import { ProductCard } from "@/components/product/ProductCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { Product } from "@/lib/types";

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <RevealGroup className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p, i) => (
        <RevealItem key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
