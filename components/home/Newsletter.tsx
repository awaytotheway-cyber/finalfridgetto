"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Send } from "lucide-react";
import { useState } from "react";
import { LeafSketch } from "@/components/ui/BotanicalDivider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Newsletter sign-up. Stubbed: swap the timeout for your ESP / Supabase insert. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("done");
  };

  return (
    <section className="container-page">
      <div className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-16 text-center text-cream sm:px-12 md:py-20">
        <LeafSketch className="pointer-events-none absolute -left-6 -top-6 h-64 w-44 rotate-12 text-cream/10" />
        <LeafSketch className="pointer-events-none absolute -bottom-10 -right-4 h-64 w-44 -rotate-[160deg] text-cream/10" />

        <p className="eyebrow text-moss">The Subhadra letter</p>
        <h2 className="mx-auto mt-4 max-w-xl text-4xl text-cream sm:text-5xl">
          Seasonal harvests &amp; <em>old kitchen wisdom</em>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-cream/75">
          One gentle email a month with recipes, new harvests and 10% off your first order.
        </p>

        <div className="mx-auto mt-10 max-w-md">
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                className="flex items-center justify-center gap-2 rounded-full bg-cream/10 px-6 py-4 text-cream"
              >
                <CircleCheck className="h-5 w-5 text-moss" /> Thank you! Check your inbox for your welcome note.
              </motion.p>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={submit} noValidate>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 sm:rounded-full sm:bg-cream sm:p-1.5">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "newsletter-error" : undefined}
                    className="h-12 flex-1 rounded-full bg-cream px-5 text-charcoal placeholder:text-stone/60 focus:outline-none sm:bg-transparent"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-terracotta px-6 font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-70"
                  >
                    {status === "loading" ? "Subscribing…" : (<>Subscribe <Send className="h-4 w-4" /></>)}
                  </button>
                </div>
                {status === "error" && (
                  <p id="newsletter-error" role="alert" className="mt-3 text-sm text-mustard">
                    Please enter a valid email address.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
