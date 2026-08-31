# How to Add a New Collection

```
Shopify Admin
   ↓
Collections → Create collection
   ↓
Set a title (Shopify auto-generates a handle, or set one manually)
   ↓
Add products to the collection (manually, or via an automated condition)
   ↓
Publish to the correct sales channel
   ↓
Visit /collections/<handle> on the frontend to verify — it resolves automatically via the
[handle] dynamic route (src/app/collections/[handle]/page.tsx), no code change needed
   ↓
Optionally add a manual link to it from the header/footer navigation
   (src/components/layout/header.tsx / footer.tsx) or the homepage category showcase
   (src/components/home/category-showcase.tsx) if you want it featured
```

See also: [Collections](../03-shopify/collections.md), [Collection Content](../07-content/collection-content.md).
