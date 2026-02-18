import Stripe from "stripe";
import { getStripeSecretKey } from "@/lib/server-env";

export function createStripeClient() {
  return new Stripe(getStripeSecretKey());
}
