# Shopify-hosted page logos → RUCHI website (one-time Shopify setting)

**Pages this fixes (verified 2026-11-20):** the logo on the **checkout and payment steps**, the **sign-in / create-account page** (`shopify.com/authentication/...`) and the order-status pages all link to the store's own address `https://kbvhs0-iu.myshopify.com/`. Making that address forward to the website fixes all of them at once. (The card form inside Razorpay's own popup is Razorpay's page and has no link back to the store.)

**Why it happens:** the checkout is hosted by Shopify. Its logo always links to the store's own address
(`https://kbvhs0-iu.myshopify.com/`), which shows the Shopify "Online Store" theme (Horizon), not the RUCHI website.
Shopify has no setting to change that link, and it does not allow a URL redirect for `/`.

**Fix:** make the Shopify store's home page forward visitors to the RUCHI website. Only the home page is affected
(checkout, order status and everything else keep working).

## Steps (about 1 minute)
1. Shopify Admin → **Online Store → Themes** → on **Horizon** click **⋯ → Edit code**.
2. Open **layout/theme.liquid**.
3. Paste the block below **right after the opening `<head>` tag**.
4. **Save**.

```liquid
{%- comment -%}
  Send visitors who land on the Shopify store's home page to the RUCHI website.
  Used by the checkout logo link. Home page only: checkout, order status and the theme editor are untouched.
  When the custom domain goes live, change the URL below.
{%- endcomment -%}
{%- if request.page_type == 'index' and request.design_mode == false -%}
  <meta http-equiv="refresh" content="0; url=https://ruchi-website-nine.vercel.app/">
  <link rel="canonical" href="https://ruchi-website-nine.vercel.app/">
  <style>body { display: none !important; }</style>
  <script>window.location.replace("https://ruchi-website-nine.vercel.app/");</script>
{%- endif -%}
```

## Check
Open `https://kbvhs0-iu.myshopify.com/` directly — it should jump to the website. Then open any checkout, and the sign-in page (`/account/login`), and click the RUCHI logo on each → you should land on https://ruchi-website-nine.vercel.app/.
Editing the theme in the Shopify theme editor still works (the redirect is off in design mode).

## Later
When you move to your own domain, replace the three `https://ruchi-website-nine.vercel.app/` URLs in the snippet.
(Best long-term option: make your own domain the store's primary domain in Shopify → Settings → Domains.)

## Why this isn't applied yet
Changing a theme needs Shopify theme access. The connector used for this project does not have it (it asked to be reconnected with theme permissions), and the store home page still showed the normal theme with no redirect when checked on 2026-11-20. Either paste the snippet above, or reconnect the Shopify connector with theme access and ask for it to be applied.
