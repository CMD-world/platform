# Stripe Payments

Setting up Stripe is easy. First, follow the Stripe setup steps in the [Production guide](../1-tutorials/2-production.md#stripe-to-handle-payments).
Once you have your Stripe API key in `.env`, you can start processing payments and subscriptions.

Here's how Stripe payments work:

1. Your app creates a checkout session
2. Customer makes payment
3. Stripe sends you a webhook notification

The code for this is already set up in `src/routes/(stripe)/checkout/+server.ts` and `src/routes/(stripe)/webhook/+server.ts`.
You can also let customers manage their subscriptions through Stripe's portal at `/portal` (code is in `src/routes/(stripe)/portal/+server.ts`).

## Customize product

To set up your product details, edit `src/routes/(stripe)/checkout/+server.ts`:

```ts
export const GET: RequestHandler = async ({ url: { origin }, locals: { user } }) => {
  // Configure your product here
  const price = 149;
  const name = "MVP starterpack";
  const images = ["https://placehold.co/640x480"];
  const description = "A complete MVP starterpack that has everything you need to build MVPs quickly.";
```

## Set up subscriptions

To change your product to a subscription instead of payment, change the creating session code in `src/routes/(stripe)/checkout/+server.ts` to this:

```ts
// Create Stripe Checkout session
const session = await stripe?.checkout.sessions.create({
  mode: "subscription",
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
        recurring: {
          interval: "month",
        },
      },
      quantity: 1,
    },
  ],
  customer: user?.customerId ?? undefined,
  customer_email: !user?.customerId ? user?.email : undefined,
  customer_creation: !user?.customerId ? "always" : undefined,
});
```

## Webhooks

Stripe sends notifications about payments to `src/routes/(stripe)/webhook/+server.ts`. To test locally:

1. Install Stripe CLI
2. Run `stripe listen --forward-to localhost:5173/webhook`
3. Go to `/checkout` and test with card number 4242 4242 4242 4242

You'll see successful payments in your console.

To customize what happens after a successful purchase, modify the webhook handler in `src/routes/(stripe)/webhook/+server.ts`:

```ts
// Handle sales
if (event?.type == "checkout.session.completed") {
  // Show details about successful payment
  const { customer_details, metadata, customer } = event.data.object;
  console.info("💸 New sale:", customer_details?.email);
  console.info("🔍 Metadata for event:", metadata);

  // Save Stripe Customer to database for faster checkouts in the future
  if (metadata && metadata.user_id && customer && typeof customer === "string") {
    await saveStripeCustomer(Number(metadata.user_id), customer);
  }
}
```
