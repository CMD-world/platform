# Production

Let's get your app ready for production! We will set up the following:

1. Error monitoring with Sentry
2. Analytics to track traffic
3. Add Google/GitHub OAuth
4. Setup email with Resend
5. Stripe to handle payments
6. Privacy policy and Terms of Service
7. Use domain name for your app

## Error monitoring with Sentry

Use the following command to set up Sentry with Fly if you haven't already, which automatically configures `SENTRY_DSN` for you:

```
fly ext sentry create
```

## Analytics to track traffic

Setup analytics without needing a cookie banner with [umami](https://umami.is):

1. Create an account at [cloud.umami.is/signup](https://cloud.umami.is/signup)
2. Click `Add website` and provide your app's name and domain
3. Click `Edit`, navigate to `Tracking code`, then copy this code to the bottom of the `<head>` tag in `src/app.html`

## Add Google/GitHub OAuth

To setup OAuth, we need to get the ID and secret from Google/GitHub then change the environment variables for our app.

### Google OAuth

1. Navigate to your Google Cloud API credentials page: https://console.cloud.google.com/apis/credentials
2. Configure the OAuth consent screen if you haven't already by clicking `CONFIGURE OAUTH SCREEN` -> `CREATE` and completing the required fields
3. Return to the Google Cloud API credentials page and click `CREATE CREDENTIALS` -> `OAuth client ID`, then select Web Application
4. For authorized redirect URIs, add `http://localhost/google/callback` for development and `https://<url>/google/callback` for production
5. Configure your Google OAuth credentials with `fly`:

```
fly secrets set GOOGLE_CLIENT_ID=$ID
fly secrets set GOOGLE_CLIENT_SECRET=$SECRET
```

5. (Optional) If you want to test OAuth locally, add the keys in `.env` as well

### GitHub OAuth

1. Access your GitHub Developer settings: https://github.com/settings/developers
2. Click `New OAuth App` to register a new application and enter your application name and homepage URL
3. Set the authorization callback URL to `http://localhost/github/callback` for development or `https://<url>/github/callback` for production
4. Configure your GitHub OAuth credentials with `fly`:

```
fly secrets set GITHUB_CLIENT_ID=$ID
fly secrets set GITHUB_CLIENT_SECRET=$SECRET
```

5. (Optional) If you want to test OAuth locally, add the keys in `.env` as well

## Setup email with Resend

1. Go to [Resend](https://resend.com) and click `Get Started` and create account
2. Click `Add API Key`, then copy it and set in production with following:

```
fly secrets set RESEND_API_KEY=$KEY
```

Add the key in `.env` so you can test locally as well

3. Click `Add domain` at the bottom of the page, then following the instructions to verify your domain
4. When your domain is verified, you can send email with any user from your domain like this:

```ts
import { resend } from "$lib/email";

resend.emails.send({
  from: "info@svelterust.com",
  to: "you@gmail.com",
  subject: "Welcome to the club!",
  html: "<p>Thanks for subscribing</p>",
});
```

## Stripe to handle payments

1. Go to [Stripe](https://stripe.com), type in your email and click `Start Now` then create an account
2. Follow the instructions to connect Stripe to your business
3. After setting up Stripe, go to [Stripe Dashboard](https://dashboard.stripe.com) and copy the Secret key under **For developers**
4. Copy the webhook secret as well in [Webhooks](https://dashboard.stripe.com/webhooks)
5. Set the Stripe key and webhook secret in production with following:

```
fly secrets set STRIPE_SECRET_KEY=$KEY
fly secrets set STRIPE_WEBHOOK_SECRET=$SECRET
```

6. (Optional) If you want to test Stripe locally, make sure the you copy the key in `Test mode` then add the key to `.env`. To verify it's working, go to `/checkout`

## Privacy policy and Terms of Service

When your app is running in production, you should include a privacy policy and a terms of service.
Head over to `src/routes/(app)/privacy-policy/+page.md` and `src/routes/(app)/terms-of-service/+page.md` and update both of them.
ChatGPT is very good at creating these kinds of documents, so to save time you can use that.

## Use domain name for your app

1. Get IP address for your application with `fly ips list`, which looks like this:

```
mvp ❯ fly ips list
VERSION	IP                    	TYPE              	REGION	CREATED AT
v6     	2a09:8280:1::53:fa48:0	public (dedicated)	global	19h6m ago
v4     	66.241.125.69         	public (shared)   	      	Jan 1 0001 00:00
```

2. Go to your domain name provider, and add an A-record to the IPv4 address and (optionally) AAAA-record to the IPv6 address. In the above case I would add following in my domain name registrar:

```
A    svelterust.com 66.241.125.69
AAAA svelterust.com 2a09:8280:1::53:fa48:0
```

3. Add certificate for your custom domain by running `fly certs add <domain name>`.

4. Wait for a couple minutes for HTTPS to activate
