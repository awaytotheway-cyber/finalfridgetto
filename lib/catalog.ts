/**
 * Catalogue data-access layer.
 *
 * Pages and components only ever call these async functions. Today they
 * read the local seed file; to move to Supabase, rewrite the bodies, e.g.
 *
 *   const { data } = await supabase.from("products").select("*");
 *
 * The function signatures (and the `Product` type) stay the same, so no
 * UI code has to change.
 */
import { categories, products } from "@/data/products";
import type { Category, CategorySlug, Product } from "@/lib/types";

export async function getProducts(category?: CategorySlug): Promise<Product[]> {
  return category ? products.filter((p) => p.category === category) : products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((p) => p.featured);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

/** Same-category products first, then fill with others. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const others = products.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return categories.some((c) => c.slug === value);
}
