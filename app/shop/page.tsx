import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { ButtonLink } from "@/components/ui/Button";
import { getCategories, getProducts, isCategorySlug } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Cold-pressed oils, bilona ghee, raw honey, single-origin spices and herbal staples.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: raw } = await searchParams;
  const category = isCategorySlug(raw) ? raw : undefined;

  const [all, categories] = await Promise.all([getProducts(), getCategories()]);
  const products = category ? all.filter((p) => p.category === category) : all;
  const current = categories.find((c) => c.slug === category);

  const counts: Record<string, number> = { all: all.length };
  for (const c of categories) counts[c.slug] = all.filter((p) => p.category === c.slug).length;

  return (
    <div className="container-page pb-8 pt-10 md:pt-16">
      <header className="max-w-2xl">
        <p className="eyebrow">The shop</p>
        <h1 className="mt-4 text-5xl sm:text-6xl">{current ? current.name : "Everything we make"}</h1>
        <p className="mt-5 text-lg text-stone">
          {current
            ? current.description
            : "Every jar and bottle is made in small batches, with no preservatives, from farms we know by name."}
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter categories={categories} active={category} counts={counts} />
        <p className="shrink-0 text-sm text-stone" aria-live="polite">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="pt-12">
        {products.length > 0 ? (
          // Keyed by category so the grid re-animates when the filter changes.
          <ProductGrid key={category ?? "all"} products={products} priorityCount={4} />
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-parchment text-forest">
              <Leaf className="h-7 w-7" strokeWidth={1.4} />
            </span>
            <h2 className="mt-6 text-3xl">Nothing on this shelf yet</h2>
            <p className="mt-2 max-w-sm text-stone">
              We&rsquo;re harvesting something new. In the meantime, have a look at the rest of the shop.
            </p>
            <ButtonLink href="/shop" className="mt-8">
              See all products
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}
