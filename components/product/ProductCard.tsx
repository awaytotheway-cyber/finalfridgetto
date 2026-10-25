"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import type { Product } from "@/lib/types";

/**
 * Product card: whole card links to the detail page. On hover the card
 * lifts, the image slowly zooms and a second photo + quick-add fade in.
 * The quick-add button is always visible on touch screens.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [primary, secondary] = product.images;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        href={`/product/${product.slug}`}
        className="block rounded-[var(--radius-card)] focus-visible:outline-offset-4"
        aria-label={`${product.name}, ${product.size}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-parchment shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift)]">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-105"
          />
          {secondary && (
            <Image
              src={secondary.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-105 group-hover:opacity-100 [@media(hover:none)]:hidden"
            />
          )}
          {product.badge && <Badge className="absolute left-4 top-4">{product.badge}</Badge>}
        </div>

        <div className="mt-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-stone">{product.tagline}</p>
            <h3 className="mt-1.5 text-xl leading-snug transition-colors group-hover:text-terracotta">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <Price amount={product.price} compareAt={product.compareAtPrice} />
              <span className="text-stone">· {product.size}</span>
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-stone">
              <Star className="h-3.5 w-3.5 fill-mustard text-mustard" aria-hidden />
              {product.rating} <span className="sr-only">out of 5,</span>({product.reviewCount})
            </p>
          </div>
        </div>
      </Link>

      {/* Quick add — overlaid on the image, but outside the link so it is its own tab stop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[4/5]">
        <div className="pointer-events-auto absolute bottom-4 right-4 transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] md:translate-y-2 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          <AddToCartButton product={product} variant="icon" />
        </div>
      </div>
    </motion.article>
  );
}
