import { stripe } from "$lib/stripe";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url: { origin }, locals: { user } }) => {
  // User must be logged in
  if (!user || !user.customerId) error(401, "You need to be logged in and purchased a product to see your portal");

  // Create Stripe Customer Portal session
  const session = await stripe?.billingPortal.sessions.create({
    customer: user.customerId,
    return_url: origin,
  });

  // Redirect to Stripe Customer Portal
  if (session && session.url) {
    redirect(303, session.url);
  } else {
    error(500, "Failed to create Stripe Customer Portal session");
  }
};
