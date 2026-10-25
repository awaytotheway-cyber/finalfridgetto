import type { Metadata } from "next";
import { ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Subhadra Agro Food Processing: orders, wholesale, or just to say hello.",
};

const DETAILS = [
  { icon: MapPin, label: "Visit", value: "Subhadra Agro Food Processing, Bhubaneswar, Odisha, India" },
  { icon: Phone, label: "Call or WhatsApp", value: "+91 90000 00000", href: "tel:+919000000000" },
  { icon: Mail, label: "Email", value: "hello@subhadraagro.in", href: "mailto:hello@subhadraagro.in" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9:30 am – 6:30 pm IST" },
];

const FAQ = [
  {
    q: "How long does delivery take?",
    a: "Orders ship within 1–2 working days and usually arrive in 3–6 working days anywhere in India. Delivery is free on orders over ₹999.",
  },
  {
    q: "Why does my honey or ghee look grainy?",
    a: "That's a good sign. Raw honey naturally crystallises in cool weather, and bilona ghee has a characteristic grainy texture. Warm the jar gently in water to soften it.",
  },
  {
    q: "Do you offer wholesale or gifting?",
    a: "Yes! We supply cafés, stores and corporate gifting. Send us a message with what you need and we'll share our catalogue.",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page pt-10 md:pt-16">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-5xl sm:text-6xl">
          We&rsquo;d love to <em className="text-sage">hear from you</em>
        </h1>
        <p className="mt-5 text-lg text-stone">
          A question about an order, a recipe, or wholesale? Write to us. A real person reads every message.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <ul className="space-y-6 rounded-[1.5rem] bg-forest p-8 text-cream sm:p-10">
            {DETAILS.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cream/20 text-moss">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/60">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block text-cream hover:text-moss">{value}</a>
                  ) : (
                    <p className="mt-1 text-cream">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <section className="mx-auto mt-28 max-w-3xl" aria-labelledby="faq-title">
        <Reveal>
          <h2 id="faq-title" className="text-center text-4xl">Common questions</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-serif text-xl text-forest [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-stone transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="pb-5 pr-10 text-stone">{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
