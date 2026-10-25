/**
 * Order placement — STUB.
 *
 * No payment is taken. Replace `placeOrder` with a real call, e.g.
 *   - a Next.js Server Action / Route Handler that inserts into a Supabase
 *     `orders` table, then
 *   - creates a Razorpay / Stripe payment and redirects to it.
 */
import type { CartItem } from "@/lib/types";

export type PaymentMethod = "upi" | "card" | "cod";

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment: PaymentMethod;
}

export interface OrderResult {
  orderId: string;
}

export async function placeOrder(details: CheckoutDetails, items: CartItem[]): Promise<OrderResult> {
  // Simulate network latency so loading states are visible.
  await new Promise((r) => setTimeout(r, 1200));
  if (items.length === 0) throw new Error("Your cart is empty.");
  void details;
  const orderId = `SA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return { orderId };
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];
