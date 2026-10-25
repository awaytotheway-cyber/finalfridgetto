"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Banknote, CircleCheck, CreditCard, Loader2, Lock, Smartphone } from "lucide-react";
import { useRef, useState } from "react";
import { CartTotals } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useMounted } from "@/lib/hooks";
import { INDIAN_STATES, placeOrder, type CheckoutDetails, type PaymentMethod } from "@/lib/orders";
import { cn, formatPrice } from "@/lib/utils";
import { selectSubtotal, useCart } from "@/store/cart";

type Errors = Partial<Record<keyof CheckoutDetails, string>>;

const EMPTY: CheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  payment: "upi",
};

const FIELD_ORDER: (keyof CheckoutDetails)[] = ["fullName", "email", "phone", "address", "city", "state", "pincode"];

function validate(d: CheckoutDetails): Errors {
  const e: Errors = {};
  if (d.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Please enter a valid email address.";
  if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(d.phone.replace(/\s/g, ""))) e.phone = "Enter a 10-digit Indian mobile number.";
  if (d.address.trim().length < 6) e.address = "Please enter your street address.";
  if (!d.city.trim()) e.city = "Please enter your city.";
  if (!d.state) e.state = "Please choose your state.";
  if (!/^[1-9]\d{5}$/.test(d.pincode)) e.pincode = "PIN code should be 6 digits.";
  return e;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string; icon: typeof Smartphone }[] = [
  { value: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", icon: Smartphone },
  { value: "card", label: "Card", hint: "Credit or debit", icon: CreditCard },
  { value: "cod", label: "Cash on delivery", hint: "Pay when it arrives", icon: Banknote },
];

export default function CheckoutPage() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);

  const [details, setDetails] = useState<CheckoutDetails>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const update = <K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(details);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { orderId } = await placeOrder(details, items);
      setOrderId(orderId);
      clear();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Order confirmed ---------- */
  if (orderId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="container-page flex flex-col items-center py-24 text-center"
        role="status"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-forest text-cream"
        >
          <CircleCheck className="h-10 w-10" strokeWidth={1.5} />
        </motion.span>
        <p className="eyebrow mt-8">Order {orderId}</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Thank you, {details.fullName.split(" ")[0]}!</h1>
        <p className="mt-4 max-w-md text-lg text-stone">
          Your order is being packed by hand. We&rsquo;ve sent a confirmation to{" "}
          <span className="text-charcoal">{details.email}</span>.
        </p>
        <p className="mt-2 text-sm text-stone">(Demo store: no payment was taken.)</p>
        <ButtonLink href="/shop" size="lg" className="mt-10">
          Continue shopping
        </ButtonLink>
      </motion.div>
    );
  }

  /* ---------- Loading / empty ---------- */
  if (!mounted) {
    return <div className="container-page min-h-[60vh] py-16" aria-busy="true" />;
  }
  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyCart />
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="container-page pt-10 md:pt-16">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-stone hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>
      <h1 className="mt-6 text-5xl">Checkout</h1>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-12 lg:col-span-7">
          <AnimatePresence>
            {errorCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="overflow-hidden rounded-xl border border-terracotta/30 bg-terracotta/5 px-5 py-4 text-sm text-terracotta-dark"
              >
                Please fix {errorCount} {errorCount === 1 ? "field" : "fields"} below to place your order.
              </motion.div>
            )}
          </AnimatePresence>

          <fieldset>
            <legend className="font-serif text-2xl text-forest">
              <span className="mr-3 text-base text-terracotta">01</span>Contact
            </legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="fullName" autoComplete="name" required className="sm:col-span-2"
                value={details.fullName} onChange={(e) => update("fullName", e.target.value)} error={errors.fullName} />
              <Field label="Email" name="email" type="email" autoComplete="email" required
                value={details.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
              <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" inputMode="tel" required
                placeholder="98765 43210" value={details.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-serif text-2xl text-forest">
              <span className="mr-3 text-base text-terracotta">02</span>Delivery address
            </legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="House no., street, area" name="address" autoComplete="street-address" required className="sm:col-span-2"
                value={details.address} onChange={(e) => update("address", e.target.value)} error={errors.address} />
              <Field label="City" name="city" autoComplete="address-level2" required
                value={details.city} onChange={(e) => update("city", e.target.value)} error={errors.city} />
              <div>
                <label htmlFor="state" className="mb-1.5 block text-sm font-medium">
                  State<span className="text-terracotta"> *</span>
                </label>
                <select
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  value={details.state}
                  onChange={(e) => update("state", e.target.value)}
                  aria-invalid={errors.state ? true : undefined}
                  aria-describedby={errors.state ? "state-msg" : undefined}
                  className="h-[50px] w-full rounded-lg border border-line bg-cream/60 px-4 text-charcoal hover:border-moss focus:border-forest focus:outline-none aria-[invalid=true]:border-terracotta"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p id="state-msg" className="mt-1.5 text-sm text-terracotta">{errors.state}</p>}
              </div>
              <Field label="PIN code" name="pincode" autoComplete="postal-code" inputMode="numeric" maxLength={6} required
                value={details.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))} error={errors.pincode} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-serif text-2xl text-forest">
              <span className="mr-3 text-base text-terracotta">03</span>Payment
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {PAYMENT_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
                const checked = details.payment === value;
                return (
                  <label
                    key={value}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta",
                      checked ? "border-forest bg-forest/5" : "border-line hover:border-moss",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={checked}
                      onChange={() => update("payment", value)}
                      className="sr-only"
                    />
                    <Icon className={cn("h-5 w-5", checked ? "text-forest" : "text-stone")} strokeWidth={1.6} />
                    <span className="font-medium">{label}</span>
                    <span className="text-xs text-stone">{hint}</span>
                    {checked && <CircleCheck className="absolute right-3 top-3 h-4 w-4 text-forest" />}
                  </label>
                );
              })}
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-stone">
              <Lock className="h-4 w-4" /> Payment integration coming soon. No money is charged in this demo.
            </p>
          </fieldset>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5" aria-label="Order summary">
          <div className="rounded-[1.5rem] border border-line bg-parchment/40 p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-2xl">Your order</h2>
            <ul className="mt-6 divide-y divide-line">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-parchment">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-forest px-1 text-[0.65rem] font-semibold text-cream">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-forest">{item.name}</p>
                    <p className="text-xs text-stone">{item.size} · Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-line pt-6">
              <CartTotals subtotal={subtotal} />
            </div>
            {submitError && (
              <p role="alert" className="mt-4 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
                {submitError}
              </p>
            )}
            <Button type="submit" size="lg" className="mt-7 w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Place order
                </>
              )}
            </Button>
            <p className="mt-4 text-center text-xs text-stone">
              By placing your order you agree to our terms. Delivery in 3–6 working days.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
