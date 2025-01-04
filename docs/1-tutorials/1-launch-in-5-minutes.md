# Launch in 5 minutes

Let's get your startup in front of your customers in less than 5 minutes:

1. If you haven't already, clone the repo and run the server locally. See [Get Started](../../README.md) if you haven't cloned the repo.

2. Delete everything in `src/routes/(app)/+page.svelte` and paste following:

```svelte
<script lang="ts">
  import Hero from "$components/Hero.svelte";
  import Brands from "$components/Brands.svelte";
  import Pricing from "$components/Pricing.svelte";
  import Review from "$components/Review.svelte";
  import Reviews from "$components/Reviews.svelte";
  import FAQ from "$components/FAQ.svelte";
  import CTA from "$components/CTA.svelte";
</script>

<Hero />
<Brands />
<Review />
<Pricing />
<FAQ />
<Reviews />
<CTA />
```

3. Delete everything in `src/routes/(app)/+layout.svelte` and paste following:

```svelte
<script lang="ts">
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";

  // Props
  const { data, children } = $props();
  const { user } = $derived(data);
</script>

<Header {user} />

<main class="container mt-4 pb-16">
  {@render children()}
</main>

<Footer />
```

4. Edit the copy to fit your business logic. Congratulations, you now have a beautiful landing page your customers will love!

> [!TIP]
> If you login with the GitHub CLI before running `fly launch`, it will automatically set `FLY_API_TOKEN` for you.
> This sets up CI/CD for you, so that when you push changes to GitHub it will automatically deploy to production.

5. It's time to launch now. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) and [turso](https://docs.turso.tech/cli/introduction) on your machine, then create new app with:

```
fly launch --no-deploy
```

If you want to setup Sentry for error monitoring, make sure to select `Yes` to _Do you want to tweak these settings before proceeding?_, then enable the Sentry extension.

Next, create a database with Turso. Choose the same region as your Fly.io app for minimal latency (change name, url and token):

```
turso db create $NAME
turso db show $NAME
turso db tokens create $NAME
fly secrets set TURSO_DATABASE_URL=$URL
fly secrets set TURSO_AUTH_TOKEN=$TOKEN
```

> [!TIP]
> In `fly.toml` under `[http_service]`, change `auto_stop_machines` to `'suspend'` to get rid of cold startups.

Finally, deploy your app and let your friends know:

```
fly deploy
```

# Production

If you want to setup error monitoring/logging (in case you didn't enable here), analytics, OAuth, Stripe, email and more, head over to the [Production guide](2-production.md).
