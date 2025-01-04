import Stripe from "stripe";
import { env } from "$env/dynamic/private";

// Create Stripe client
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
  })
  : null;
