"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Large crossfading image with a thumbnail rail (keyboard accessible). */
export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div role="tablist" aria-label={`${name} photos`} className="flex gap-3 md:flex-col">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show photo ${i + 1}: ${img.alt}`}
            onClick={() => setIndex(i)}
            className={cn(
              "relative h-20 w-16 overflow-hidden rounded-xl bg-parchment transition-all duration-300 md:h-24 md:w-20",
              i === index ? "ring-2 ring-forest ring-offset-2 ring-offset-cream" : "opacity-60 hover:opacity-100",
            )}
          >
            <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[1.5rem] bg-parchment shadow-[var(--shadow-soft)]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
