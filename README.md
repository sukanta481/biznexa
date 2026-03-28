## Biznexa

### Local development

Start the project:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### When localhost starts throwing random Next.js errors

This project has occasionally hit stale `.next` cache issues during local development, especially after switching between `next dev` and `next build`.

Common symptoms:

- `Internal Server Error` on routes that were working before
- missing generated module errors such as `Cannot find module './873.js'`
- broken admin styling because `/_next/static/css/...` returns `404`

Use this one-command reset:

```bash
npm run dev:reset
```

If you only want to clear the cache:

```bash
npm run clean:next
```

### Homepage content database sync

Homepage content is stored in the `settings` table using JSON-based keys such as:

- `homepage_hero`
- `homepage_stats`
- `homepage_services_intro`
- `homepage_services`
- `homepage_global_reach`
- `homepage_testimonials_intro`
- `homepage_testimonials`
- `homepage_faq_intro`
- `homepage_faqs`
- `homepage_cta`

Run the homepage setup SQL before using the admin homepage editor:

```text
db/homepage-settings-alignment.sql
```
