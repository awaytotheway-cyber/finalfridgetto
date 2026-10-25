import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BotanicalDivider } from "@/components/ui/BotanicalDivider";
import { unsplash } from "@/lib/utils";

export function StoryTeaser() {
  return (
    <section className="container-page py-24 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] rounded-br-[8rem] shadow-[var(--shadow-lift)]">
            <Image
              src={unsplash("1707811179851-c1f93698ad46", 1200)}
              alt="A farmer in rural India holding a freshly harvested plant in her field"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-forest px-6 py-5 text-cream shadow-[var(--shadow-lift)] sm:block lg:-right-8">
            <p className="font-serif text-4xl">120+</p>
            <p className="text-sm text-cream/75">partner farming families</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">
            Rooted in the soil, <em className="text-sage">and in memory</em>
          </h2>
          <div className="mt-7 space-y-5 text-lg text-stone">
            <p>
              Subhadra began in a grandmother&rsquo;s kitchen, where ghee was churned at dawn and turmeric
              dried on the rooftop. We never wanted to improve on that, only to share it.
            </p>
            <p>
              Today we work directly with small farms across India, process everything in small batches,
              and bottle it without a single preservative. Slow food, made with patience.
            </p>
          </div>
          <BotanicalDivider className="my-9 justify-start" />
          <ButtonLink href="/about" variant="secondary" size="lg">
            Read our story
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
