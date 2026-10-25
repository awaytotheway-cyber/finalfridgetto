"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Truck } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { LeafSketch } from "@/components/ui/BotanicalDivider";
import { unsplash } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

/** Circular "seal" text that slowly rotates — a vintage apothecary touch. */
function Seal() {
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="h-28 w-28 text-forest"
      animate={{ rotate: 360 }}
      transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      aria-hidden
    >
      <defs>
        <path id="seal-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--color-cream)" />
      <text fontSize="9.5" fill="currentColor" style={{ textTransform: "uppercase" }}>
        {/* textLength = circumference (2πr ≈ 289) so the phrase closes the loop exactly */}
        <textPath href="#seal-circle" textLength="286" lengthAdjust="spacing">
          100% natural · no preservatives ·
        </textPath>
      </text>
      <path d="M60 76V46" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M60 58c-6-1.5-9.5-6-10.5-12 6 .8 9.7 5.2 10.5 12Z" fill="var(--color-terracotta)" />
      <path d="M60 66c6-1.5 9.5-6 10.5-12-6 .8-9.7 5.2-10.5 12Z" fill="currentColor" />
    </motion.svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <LeafSketch className="pointer-events-none absolute -left-10 top-24 hidden h-72 w-52 -rotate-12 text-moss/30 lg:block" />

      <div className="container-page grid items-center gap-14 pb-20 pt-8 md:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-28">
        {/* Copy */}
        <div className="relative lg:col-span-6">
          <motion.p {...fadeUp(0.05)} className="eyebrow">
            From Indian farms to your shelf
          </motion.p>

          <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.2rem)] font-normal leading-[1.02]">
            <motion.span {...fadeUp(0.15)} className="block">
              Pure food,
            </motion.span>
            <motion.span {...fadeUp(0.28)} className="block italic text-sage">
              made slowly.
            </motion.span>
          </h1>

          <motion.p {...fadeUp(0.42)} className="mt-7 max-w-md text-lg text-stone sm:text-xl">
            Cold-pressed oils, hand-churned ghee, raw honey and single-origin spices. No preservatives,
            nothing hidden. Just honest food from the farms we know by name.
          </motion.p>

          <motion.div {...fadeUp(0.55)} className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/shop" size="lg" className="group">
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/about" size="lg" variant="secondary">
              Our story
            </ButtonLink>
          </motion.div>

          <motion.ul {...fadeUp(0.68)} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone">
            <li className="flex items-center gap-2">
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-mustard text-mustard" />
                ))}
              </span>
              4.8 from 1,200+ kitchens
            </li>
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-forest" aria-hidden />
              Free delivery over ₹999
            </li>
          </motion.ul>
        </div>

        {/* Imagery */}
        <div className="relative lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
            className="relative ml-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[2rem] rounded-tl-[10rem] bg-parchment shadow-[var(--shadow-lift)]"
          >
            <motion.div style={{ y: imageY }} className="absolute inset-[-6%_0]">
              <Image
                src={unsplash("1785248197578-62b9b9ef2338", 1400)}
                alt="An old wooden apothecary cabinet filled with glass jars of dried herbs"
                fill
                priority
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Floating product card */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
            className="absolute -bottom-8 left-0 w-44 rounded-2xl bg-cream p-3 shadow-[var(--shadow-lift)] sm:w-52 lg:-left-6"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={unsplash("1587049352851-8d4e89133924", 500)}
                alt="Jar of raw wild forest honey"
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
            <p className="mt-3 px-1 font-serif text-lg leading-tight text-forest">Wild Forest Honey</p>
            <p className="px-1 pb-1 text-sm text-stone">Raw · Unheated</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
            className="absolute -top-4 right-2 rounded-full shadow-[var(--shadow-soft)] sm:right-6 lg:-right-4"
          >
            <Seal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
