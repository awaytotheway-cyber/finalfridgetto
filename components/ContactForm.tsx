"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Loader2, Send } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/ui/Field";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "Please write a little more (at least 10 characters).";
  return e;
}

/** Contact form. Stubbed: replace the timeout with a Route Handler / Supabase insert. */
export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
  };

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className="flex flex-col items-start rounded-[1.5rem] bg-parchment/60 p-10"
        >
          <CircleCheck className="h-10 w-10 text-forest" strokeWidth={1.4} />
          <h2 className="mt-5 text-3xl">Thank you, {values.name.split(" ")[0]}.</h2>
          <p className="mt-3 text-stone">
            Your note is with us. We reply to every message personally, usually within one working day.
          </p>
          <button
            type="button"
            className="mt-6 text-sm text-forest underline underline-offset-4 hover:text-terracotta"
            onClick={() => {
              setValues({ name: "", email: "", message: "" });
              setStatus("idle");
            }}
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" ref={formRef} exit={{ opacity: 0 }} onSubmit={submit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" name="name" autoComplete="name" required value={values.name} onChange={set("name")} error={errors.name} />
            <Field label="Email" name="email" type="email" autoComplete="email" required value={values.email} onChange={set("email")} error={errors.email} />
          </div>
          <TextArea label="Message" name="message" required placeholder="Questions about an order, wholesale, or just to say hello…" value={values.message} onChange={set("message")} error={errors.message} />
          <Button type="submit" size="lg" disabled={status === "sending"}>
            {status === "sending" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>) : (<>Send message <Send className="h-4 w-4" /></>)}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
