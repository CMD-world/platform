import { stripe } from "$lib/stripe";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url: { origin }, locals: { user } }) => {
  // Configure your product here
  const price = 149;
  const name = "MVP starterpack";
  const images = ["https://placehold.co/640x480"];
  const description = "A complete MVP starterpack that has everything you need to build MVPs quickly.";

  // Create Stripe Checkout session
  const session = await stripe?.checkout.sessions.create({
    mode: "payment",
    cancel_url: origin,
    success_url: origin,
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name,
            images,
            description,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    customer: user?.customerId ?? undefined,
    customer_email: !user?.customerId ? user?.email : undefined,
    customer_creation: !user?.customerId ? "always" : undefined,
  });

  // Redirect to Stripe Checkout
  if (session?.url) {
    redirect(303, session.url);
  } else {
    error(500, "Failed to create Stripe Checkout session");
  }
};
