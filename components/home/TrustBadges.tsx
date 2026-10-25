import { HandHeart, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const BADGES = [
  { icon: Leaf, title: "100% Natural", text: "Real ingredients you can pronounce. Nothing synthetic." },
  { icon: ShieldCheck, title: "No Preservatives", text: "No additives, colours or chemical processing. Ever." },
  { icon: Sprout, title: "Farm-Sourced", text: "Bought directly from smallholder farmers at fair prices." },
  { icon: HandHeart, title: "Small-Batch Made", text: "Pressed, churned and ground slowly, the traditional way." },
];

export function TrustBadges() {
  return (
    <section aria-label="Our promise" className="border-y border-line bg-parchment/50">
      <RevealGroup className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4">
        {BADGES.map(({ icon: Icon, title, text }) => (
          <RevealItem key={title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-forest/15 bg-cream text-forest">
              <Icon className="h-6 w-6" strokeWidth={1.4} />
            </span>
            <h3 className="mt-5 text-xl">{title}</h3>
            <p className="mt-2 text-sm text-stone sm:text-[0.95rem]">{text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
