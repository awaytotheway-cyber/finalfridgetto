# Subhadra Agro Food Processing — Storefront

An e-commerce site for natural, farm-to-shelf food: cold-pressed oils, bilona ghee, raw honey, single-origin spices and herbal staples.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Zustand (persisted cart) · lucide-react

---

## Run it

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
```

## What's inside

| Route | What it does |
| --- | --- |
| `/` | Hero, trust badges, featured products, categories, story teaser, newsletter |
| `/shop` | Product grid with category filter (`/shop?category=spices`) and a skeleton loading state |
| `/product/[slug]` | Gallery, price, description, ingredients, benefits, quantity, add to cart, related products |
| `/cart` | Full cart page. A slide-in cart drawer is also available from every page |
| `/checkout` | Single-page validated form, payment method picker, order confirmation (stubbed) |
| `/about` | Brand story |
| `/contact` | Contact form, details and FAQ |

The cart is saved to `localStorage`, so it survives reloads. All motion respects the user's `prefers-reduced-motion` setting.

### Folder map

```
app/              Routes (App Router). layout.tsx = navbar, footer, cart drawer
components/
  layout/         Navbar, CartDrawer, Footer
  home/           Home page sections
  product/        ProductCard, ProductGrid, Gallery, CategoryFilter, AddToCartButton…
  cart/           Cart line item, totals, empty state
  ui/             Button, Field, Badge, Price, Logo, SectionHeading, botanical ornaments
  motion/         Reveal (scroll-reveal), FlyToCart, MotionProvider
data/products.ts  Seed products and categories
lib/catalog.ts    Data access: the only thing pages call to get products
lib/orders.ts     Order placement stub
lib/types.ts      Product / Category / CartItem types
store/cart.ts     Zustand cart store
app/globals.css   Design tokens (colours, fonts, shadows)
```

---

## Adding real products

Edit **`data/products.ts`**. Each product follows the `Product` type in `lib/types.ts`:

```ts
{
  id: "p-ghee",
  slug: "a2-bilona-desi-ghee",      // URL: /product/a2-bilona-desi-ghee
  name: "A2 Bilona Desi Ghee",
  tagline: "Hand-churned · Gir cow milk",
  category: "oils-ghee",            // one of the slugs in `categories`
  price: 1249,                      // whole rupees
  compareAtPrice: 1399,             // optional, shown struck through
  size: "500 ml",
  description: "…",
  ingredients: ["…"],
  benefits: ["…"],
  images: [{ src: "…", alt: "…" }], // first image = thumbnail
  featured: true,                   // shows on the home page
  badge: "Bestseller",              // optional card label
  rating: 4.9,
  reviewCount: 312,
}
```

To add a category, add it to `categories` in the same file and to the `CategorySlug` union in `lib/types.ts`.

## Adding real images

Product photos currently come from Unsplash through the `unsplash("<photo-id>")` helper. To use your own:

1. **Local files:** put them in `public/images/` and set `src: "/images/ghee-1.jpg"`.
2. **A CDN or Supabase Storage:** use the full URL, and add the host to `images.remotePatterns` in `next.config.ts`.

Portrait photos (4:5) on a calm, natural-light background look best in the cards. Images used on the home and about pages are set directly in `components/home/*` and `app/about/page.tsx`.

## Moving to Supabase later

The UI never reads `data/products.ts` directly. Everything goes through the async functions in **`lib/catalog.ts`**, so switching backends touches only that file.

1. `npm install @supabase/supabase-js` and add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
2. Create a `products` table whose columns mirror the `Product` type (`images`, `ingredients` and `benefits` work well as `jsonb` or `text[]`), plus a `categories` table.
3. Rewrite the functions in `lib/catalog.ts`, for example:

   ```ts
   export async function getProducts(category?: CategorySlug) {
     let q = supabase.from("products").select("*");
     if (category) q = q.eq("category", category);
     const { data, error } = await q;
     if (error) throw error;
     return data as Product[];
   }
   ```

4. **Orders:** replace `placeOrder` in `lib/orders.ts` with a Server Action or Route Handler that inserts into an `orders` table, then starts a payment with Razorpay, Stripe or similar.
5. **Forms:** the newsletter (`components/home/Newsletter.tsx`) and contact form (`components/ContactForm.tsx`) are stubbed with a timeout. Point them at a table or your email provider.

Enable Row Level Security on every table: public read on `products` and `categories`, and inserts on `orders` only through your server code.

## Placeholder content to replace

The address, phone number, email, social links, review counts and the "120+ partner families" figure are sample content. They live in `components/layout/Footer.tsx`, `app/contact/page.tsx`, `components/home/*` and `data/products.ts`.
