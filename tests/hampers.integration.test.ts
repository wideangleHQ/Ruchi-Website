// Integration tests (hampers + product-card image boxes) against a running site (default http://localhost:3000, override with BASE_URL).
// Start the app first (`npm run dev` or `npm run start`); the suite skips itself when nothing is listening.
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

async function get(path: string): Promise<{ status: number; html: string } | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(60_000) });
    return { status: res.status, html: await res.text() };
  } catch {
    return null;
  }
}

test("hampers: site is reachable", async (t) => {
  if (!(await get("/"))) t.skip(`no server at ${BASE}`);
});

const cardTitles = (html: string) => [...html.matchAll(/<h3[^>]*>\s*([^<]+?)\s*<\/h3>/g)].map((m) => m[1]);

test("hampers: the Shop sidebar lists Hampers as a category", async (t) => {
  const page = await get("/products");
  if (!page) return t.skip(`no server at ${BASE}`);
  assert.equal(page.status, 200);
  assert.match(page.html, /name="category"[\s\S]{0,400}?>Hampers</, "Hampers radio option missing in Shop sidebar");
});

test('hampers: "All Products" does not list hamper products', async (t) => {
  const hampers = await get("/products?category=hampers");
  const all = await get("/products");
  if (!hampers || !all) return t.skip(`no server at ${BASE}`);
  const hamperTitles = cardTitles(hampers.html);
  assert.ok(hamperTitles.length >= 1, "no hampers found");
  const allTitles = new Set(cardTitles(all.html));
  for (const title of hamperTitles) assert.ok(!allTitles.has(title), `"${title}" must not be in All Products`);
});

test("hampers: the Hampers category lists hampers and no regular products", async (t) => {
  const page = await get("/products?category=hampers");
  if (!page) return t.skip(`no server at ${BASE}`);
  assert.equal(page.status, 200);
  const titles = cardTitles(page.html);
  assert.ok(titles.length >= 1, "expected at least one hamper card");
  assert.ok(titles.every((x) => /\(\d+-In-1\)|Combo|Pack|Kit|Box/i.test(x)), `non-hamper product in Hampers: ${titles.join(" | ")}`);
  assert.ok((page.html.match(/aria-label="Add to cart"/g) ?? []).length >= titles.length - 1);
});

test("hampers: another category does not leak hampers", async (t) => {
  const page = await get("/products?category=basic-spices");
  const hampers = await get("/products?category=hampers");
  if (!page || !hampers) return t.skip(`no server at ${BASE}`);
  const regular = new Set(cardTitles(page.html));
  for (const title of cardTitles(hampers.html)) assert.ok(!regular.has(title), `"${title}" leaked into Basic Spices`);
});

test("hampers: home page tile links to the Shop's Hampers category", async (t) => {
  const page = await get("/");
  if (!page) return t.skip(`no server at ${BASE}`);
  assert.ok(page.html.includes('href="/products?category=hampers"'), "Hampers tile link missing on home");
});

test("hampers: the header navigation does NOT contain a Hampers link", async (t) => {
  const page = await get("/");
  if (!page) return t.skip(`no server at ${BASE}`);
  const header = page.html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
  assert.ok(header.length > 0, "header not found");
  assert.ok(!/>\s*Hampers\s*</.test(header), "Hampers must not be in the header");
});

test("hampers: the collection page still works for existing links (footer)", async (t) => {
  const page = await get("/collections/hampers");
  if (!page) return t.skip(`no server at ${BASE}`);
  assert.equal(page.status, 200);
  assert.match(page.html, /<h1[^>]*>\s*Hampers\s*<\/h1>/);
});

test("hampers: an unknown collection shows the not-found page and is not indexable", async (t) => {
  const page = await get("/collections/definitely-not-a-collection");
  if (!page) return t.skip(`no server at ${BASE}`);
  // Next streams the page shell first, so the status can be 200 in dev; the content is what matters.
  assert.ok(page.status === 404 || page.status === 200);
  assert.match(page.html, /Page not found/);
  assert.match(page.html, /noindex/);
});

// Card image boxes: 1:1, pure white, and the photo fitted inside (object-contain).
for (const path of ["/products", "/"]) {
  test(`cards (${path}): image box is square and white, image is contained`, async (t) => {
    const page = await get(path);
    if (!page) return t.skip(`no server at ${BASE}`);
    const boxes = [...page.html.matchAll(/<div class="relative w-full[^"]*aspect-square[^"]*">/g)].map((m) => m[0]);
    assert.ok(boxes.length >= 4, `expected product card image boxes on ${path}, found ${boxes.length}`);
    for (const box of boxes) {
      assert.ok(box.includes("bg-white"), `image box must be white: ${box}`);
      assert.ok(!box.includes("f7f6f2"), `image box must not use the old grey: ${box}`);
    }
    assert.ok(/object-contain[^"]*!bg-white|!bg-white[^"]*object-contain/.test(page.html), "card images must use object-contain on white");
  });
}
