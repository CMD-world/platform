# SEO

Search Engine Optimization (SEO) is crucial for making your SvelteKit website discoverable by search engines.
Here's how to implement essential SEO features in your SvelteKit application.

## Metadata

Create metadata for each page by putting it inside `<svelte:head>`:

```svelte
<svelte:head>
  <title>Your Page Title</title>
  <meta name="description" content="Your page description" />
  <meta name="keywords" content="your, keywords, here" />
</svelte:head>
```

## Open Graph Tags

Add Open Graph tags for better social media sharing:

```svelte
<svelte:head>
  <meta property="og:title" content="Your Title" />
  <meta property="og:description" content="Your Description" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:type" content="website" />
</svelte:head>
```

## Twitter Cards

Add Twitter Card tags for better Twitter sharing:

```svelte
<svelte:head>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Your Title" />
  <meta name="twitter:description" content="Your Description" />
  <meta name="twitter:image" content="https://example.com/image.jpg" />
</svelte:head>
```

## Robots Meta Tag

Control search engine crawling:

```svelte
<svelte:head>
  <meta name="robots" content="index, follow" />
</svelte:head>
```

## Canonical URLs

Specify canonical URLs to prevent duplicate content issues:

```svelte
<svelte:head>
  <link rel="canonical" href="https://example.com/your-page" />
</svelte:head>
```

## JSON-LD Structured Data

Add structured data for rich search results:

```svelte
<svelte:head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Article Title",
      "author": {
        "@type": "Person",
        "name": "Author Name"
      },
      "datePublished": "2023-01-01"
    }
  </script>
</svelte:head>
```

## SEO Best Practices

1. **Server-Side Rendering**: Use SvelteKit's SSR capabilities for better SEO performance.
2. **Semantic HTML**: Use proper HTML semantics (`<article>`, `<nav>`, `<header>`, etc.).
3. **Responsive Images**: Use appropriate image sizes (for static images, use `<enhanced:img>`) and the `alt` attribute.
4. **URL Structure**: Create clean, descriptive URLs using SvelteKit's routing.
