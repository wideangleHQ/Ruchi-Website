# Local Setup

```
Prerequisites: Node.js (a version compatible with Next.js 16 / React 19) and npm
     ↓
git clone <repository-url>
     ↓
cd "Ruchi Website"
     ↓
npm install
     ↓
cp .env.example .env.local
     ↓
# Edit .env.local and fill in:
#   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
#   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-api-token
#   SHOPIFY_API_VERSION=2025-01
     ↓
npm run dev
```

The dev server starts on `http://localhost:3000` (Next.js default; confirmed by this project's `.claude/launch.json` dev-server config, which targets port 3000).

## If you don't configure `.env.local`

The site still runs — product/collection pages will silently render the hardcoded mock data from [mock-data.ts](../../../src/lib/shopify/mock-data.ts) instead of failing. This is convenient for pure frontend/UI work but means **a developer cannot assume "the site is working" is the same as "Shopify is connected."** See [Error Handling](../04-frontend/error-handling.md) and [Troubleshooting](../10-maintenance/troubleshooting.md) for how to tell the two apart.

See also: [Environment Variables](environment.md), [Development Workflow](workflow.md).
