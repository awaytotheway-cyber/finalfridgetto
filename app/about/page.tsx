import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BotanicalDivider, LeafSketch } from "@/components/ui/BotanicalDivider";
import { unsplash } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Subhadra Agro Food Processing brings slow, traditional, preservative-free food from Indian farms to your kitchen.",
};

const PROCESS = [
  { n: "I", title: "Grow", text: "We partner with smallholder farms that grow without synthetic pesticides, and pay them above market rates." },
  { n: "II", title: "Harvest", text: "Crops are picked at their peak, by hand where it matters, and never stored longer than a season." },
  { n: "III", title: "Process", text: "Wood-pressed, hand-churned, sun-dried, stone-ground. Slow methods that keep nutrients alive." },
  { n: "IV", title: "Bottle", text: "Packed in small batches with no preservatives, then shipped straight to you, fresh." },
];

export default function AboutPage() {
  return (
    <>
      {/* Opening */}
      <section className="container-page pt-10 text-center md:pt-20">
        <Reveal>
          <p className="eyebrow">Our story</p>
          <h1 className="mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,6.5vw,5rem)] font-normal leading-[1.04]">
            A grandmother&rsquo;s kitchen, <em className="text-sage">bottled with care</em>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg text-stone sm:text-xl">
            Subhadra Agro Food Processing exists to keep India&rsquo;s slow food traditions alive, and to put them back on
            everyday kitchen shelves.
          </p>
        </Reveal>
      </section>

      <Reveal className="container-page mt-16 md:mt-20">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)] md:aspect-[21/9]">
          <Image
            src={unsplash("1767607186818-3094b408222f", 2000)}
            alt="A vast field of yellow mustard flowers in West Bengal under soft sunlight"
            fill
            priority
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
        <p className="mt-3 text-right text-xs italic text-stone">Mustard fields in bloom, West Bengal</p>
      </Reveal>

      {/* Editorial narrative */}
      <section className="container-page py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="eyebrow">Chapter one</p>
            <h2 className="mt-4 text-4xl">Where it began</h2>
            <LeafSketch className="mt-8 hidden h-48 w-32 text-moss/60 md:block" />
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-charcoal/85 md:col-span-8 md:columns-2 md:gap-10 md:space-y-0 [&>p]:md:mb-6">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-terracotta">
              Every family has a kitchen they remember. Ours smelled of ghee warming over a wood fire, of turmeric drying
              on the rooftop, of mustard oil crackling with the first seeds of a tadka.
            </p>
            <p>
              Our grandmother, Subhadra, never measured anything. She knew ghee was ready by its sound, and that honey
              should be bought only from the people who climbed the trees for it. She believed food should be made
              slowly, by hand, and shared generously.
            </p>
            <p>
              As we grew up, we watched those foods disappear from shop shelves, replaced by refined, bleached and
              preserved versions that looked the same but tasted of nothing. So we went back to the farms.
            </p>
            <p>
              Today Subhadra Agro works with over a hundred farming families across India. We still make everything
              in small batches, the way she did. We&rsquo;ve just added a website.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-parchment/60 py-24 md:py-28">
        <Reveal className="container-page text-center">
          <BotanicalDivider />
          <blockquote className="mx-auto mt-10 max-w-3xl">
            <p className="font-serif text-3xl italic leading-snug text-forest sm:text-4xl">
              &ldquo;If you wouldn&rsquo;t cook it in your own kitchen, it doesn&rsquo;t belong in a jar.&rdquo;
            </p>
            <footer className="mt-6 text-sm uppercase tracking-[0.2em] text-stone">The Subhadra rule</footer>
          </blockquote>
        </Reveal>
      </section>

      {/* Process */}
      <section className="container-page py-24 md:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">From field to shelf</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Four slow steps</h2>
        </Reveal>
        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s) => (
            <RevealItem key={s.n} className="bg-cream p-8">
              <p className="font-serif text-5xl italic text-moss">{s.n}</p>
              <h3 className="mt-6 text-2xl">{s.title}</h3>
              <p className="mt-3 text-stone">{s.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Image pair */}
      <section className="container-page">
        <div className="grid gap-6 md:grid-cols-5">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:col-span-2">
            <Image
              src={unsplash("1530507629858-e4977d30e9e0", 1000)}
              alt="A woman farmer harvesting rice in a green paddy field in Kerala"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:col-span-3 md:aspect-auto">
            <Image
              src={unsplash("1576394435759-02a2674ff6e0", 1400)}
              alt="A pot of jaggery-sweetened pongal slow-cooking over a wood fire"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-24 text-center md:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-4xl sm:text-5xl">
            Taste the difference <em className="text-sage">slow makes</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-stone">
            Start with our bestselling bilona ghee or wild forest honey. Your kitchen will thank you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" size="lg">Shop the collection</ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">Get in touch</ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
