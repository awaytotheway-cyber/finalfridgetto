import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FlyToCartLayer } from "@/components/motion/FlyToCart";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Subhadra Agro — Pure, farm-sourced herbal foods",
    template: "%s · Subhadra Agro",
  },
  description:
    "Cold-pressed oils, bilona ghee, raw honey, single-origin spices and herbal staples — made slowly, with no preservatives, straight from Indian farms.",
};

export const viewport: Viewport = {
  themeColor: "#faf7f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="grain flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-forest px-5 py-3 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <FlyToCartLayer />
        </MotionProvider>
      </body>
    </html>
  );
}
