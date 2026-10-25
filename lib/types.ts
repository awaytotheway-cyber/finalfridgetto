/**
 * Shared domain types.
 * These mirror the shape a future Supabase `products` table should have,
 * so swapping the data source never touches UI components.
 */

export type CategorySlug = "oils-ghee" | "spices" | "sweeteners" | "herbal-wellness";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Short line shown on cards, e.g. "Wood-pressed · Kachi Ghani" */
  tagline: string;
  category: CategorySlug;
  /** Price in whole rupees (INR). */
  price: number;
  /** Optional original price, shown struck through. */
  compareAtPrice?: number;
  /** Pack size, e.g. "500 g" or "1 L" */
  size: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  /** First image is the hero/thumbnail. */
  images: ProductImage[];
  featured?: boolean;
  badge?: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}
