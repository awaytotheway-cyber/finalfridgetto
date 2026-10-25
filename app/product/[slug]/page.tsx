import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Leaf, RotateCcw, Star, Truck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Gallery } from "@/components/product/Gallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { BotanicalDivider } from "@/components/ui/BotanicalDivider";
import { Price } from "@/components/ui/Price";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

/** Pre-render every product page at build time. */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: { images: [product.images[0].src] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categories] = await Promise.all([getRelatedProducts(product), getCategories()]);
  const category = categories.find((c) => c.slug === product.category);

  return (
    <>
      <div className="container-page pt-6 md:pt-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-stone">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/shop" className="hover:text-forest">Shop</Link></li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            {category && (
              <>
                <li>
                  <Link href={`/shop?category=${category.slug}`} className="hover:text-forest">{category.name}</Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </>
            )}
            <li aria-current="page" className="text-charcoal">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Gallery images={product.images} name={product.name} />

          <div className="lg:pt-4">
            <p className="eyebrow">{product.tagline}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-stone">
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={i < Math.round(product.rating) ? "h-4 w-4 fill-mustard text-mustard" : "h-4 w-4 text-line"}
                  />
                ))}
              </span>
              <span>
                {product.rating} <span className="sr-only">out of 5</span> · {product.reviewCount} reviews
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <Price amount={product.price} compareAt={product.compareAtPrice} className="text-2xl" />
              <span className="text-stone">· {product.size}</span>
            </div>
            <p className="mt-1 text-sm text-stone">Inclusive of all taxes</p>

            <p className="mt-7 text-lg leading-relaxed text-charcoal/85">{product.description}</p>

            <div className="mt-9">
              <ProductPurchase product={product} />
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 rounded-2xl border border-line px-5 py-4 text-sm text-stone">
              <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-forest" />Free delivery over ₹999</li>
              <li className="flex items-center gap-2"><Leaf className="h-4 w-4 text-forest" />No preservatives</li>
              <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-forest" />7-day easy returns</li>
            </ul>

            <BotanicalDivider className="my-10 justify-start" />

            <div className="grid gap-10 sm:grid-cols-2">
              <section>
                <h2 className="text-2xl">Ingredients</h2>
                <ul className="mt-4 space-y-2 text-charcoal/85">
                  {product.ingredients.map((ing) => (
                    <li key={ing} className="flex gap-2">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" aria-hidden />
                      {ing}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-stone">Nothing else. No preservatives, colours or additives.</p>
              </section>
              <section>
                <h2 className="text-2xl">Why you&rsquo;ll love it</h2>
                <ul className="mt-4 space-y-3 text-charcoal/85">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-sage" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page mt-28 border-t border-line pt-20">
          <Reveal>
            <SectionHeading eyebrow="Pairs well with" title="You may also like" className="mb-14" />
          </Reveal>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
