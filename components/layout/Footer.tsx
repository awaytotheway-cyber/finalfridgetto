import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { categories } from "@/data/products";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />
    </svg>
  );
}

const linkClass = "text-cream/75 transition-colors hover:text-cream";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-forest text-cream">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11 text-moss" />
            <div>
              <p className="font-serif text-2xl text-cream">Subhadra</p>
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/60">Agro Food Processing</p>
            </div>
          </div>
          <p className="mt-6 max-w-xs text-cream/75">
            Pure, farm-sourced food made slowly and honestly, from Indian fields to your kitchen shelf.
          </p>
          <div className="mt-6 flex gap-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-forest">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-forest">
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Shop categories" className="md:col-span-3">
          <h2 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-moss">Shop</h2>
          <ul className="mt-5 space-y-3">
            <li><Link href="/shop" className={linkClass}>All products</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className={linkClass}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="md:col-span-2">
          <h2 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-moss">Company</h2>
          <ul className="mt-5 space-y-3">
            <li><Link href="/about" className={linkClass}>Our Story</Link></li>
            <li><Link href="/contact" className={linkClass}>Contact</Link></li>
            <li><Link href="/cart" className={linkClass}>Cart</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-moss">Visit us</h2>
          <ul className="mt-5 space-y-3 text-cream/75">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-moss" />Subhadra Agro Food Processing, Bhubaneswar, Odisha, India</li>
            <li><a href="tel:+919000000000" className={`flex gap-3 ${linkClass}`}><Phone className="mt-0.5 h-4 w-4 shrink-0 text-moss" />+91 90000 00000</a></li>
            <li><a href="mailto:hello@subhadraagro.in" className={`flex gap-3 ${linkClass}`}><Mail className="mt-0.5 h-4 w-4 shrink-0 text-moss" />hello@subhadraagro.in</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-sm text-cream/55 sm:flex-row">
          <p>© {new Date().getFullYear()} Subhadra Agro Food Processing. All rights reserved.</p>
          <p>Made with care, in small batches.</p>
        </div>
      </div>
    </footer>
  );
}
