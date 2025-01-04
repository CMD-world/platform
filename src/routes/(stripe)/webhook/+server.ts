import { stripe } from "$lib/stripe";
import { env } from "$env/dynamic/private";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { userTable } from "$lib/schema";
import { db } from "$lib/database";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ request }) => {
  // Verify that request is from Stripe
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    error(500, "Signature for request or server is missing");
  }
  const event = await stripe?.webhooks.constructEventAsync(body, signature, env.STRIPE_WEBHOOK_SECRET);

  // Handle new purchases
  if (event?.type == "checkout.session.completed") {
    // Give user access to product
    const { customer_details, metadata, customer } = event.data.object;
    console.info("💸 New sale:", customer_details?.email);
    console.info("🔍 Metadata for event:", metadata);

    // Save Stripe Customer to database for faster checkouts in the future
    if (metadata && metadata.user_id && customer && typeof customer === "string") {
      await saveStripeCustomer(Number(metadata.user_id), customer);
    }
  }

  // Handle abandoned carts
  if (event?.type == "checkout.session.expired") {
    // User didn't complete the transaction, optionally send an abandoned cart email
    console.info("💫 Expired checkout:", event.data.object);
  }

  // Handle successful payments
  if (event?.type == "invoice.paid") {
    // Give access to user again
    console.info("💰 Payment successful:", event.data.object);
  }

  // Handle failed payments
  if (event?.type == "invoice.payment_failed") {
    // Show details about failed payments
    console.info("⚠️ User needs to update payment method:", event.data.object);
  }

  // Handle canceled subscriptions
  if (event?.type == "customer.subscription.deleted") {
    // Show details about canceled subscription
    console.info("🔴 Subscription canceled:", event.data.object);
  }

  // Return success response
  return json({ status: "Successfully processed event!" });
};

async function saveStripeCustomer(userId: number, customerId: string) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId))
    .then((users) => users[0]);
  if (!user.customerId) {
    await db.update(userTable).set({ customerId }).where(eq(userTable.id, userId));
  }
}
