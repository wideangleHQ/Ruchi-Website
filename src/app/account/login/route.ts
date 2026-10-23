import { NextResponse, type NextRequest } from "next/server";
import { buildAuthorizeUrl, clientId } from "@/lib/shopify/customer-account";
import { CA_COOKIES, resolveOrigin } from "@/lib/shopify/customer-account-core";

export async function GET(req: NextRequest) {
  const origin = resolveOrigin({ siteUrl: process.env.SITE_URL, headers: req.headers, fallbackProtocol: req.nextUrl.protocol });
  if (!clientId()) return NextResponse.redirect(`${origin}/account?error=config`);
  const { url, state, verifier } = await buildAuthorizeUrl(`${origin}/account/callback`);
  const res = NextResponse.redirect(url);
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 600 };
  res.cookies.set(CA_COOKIES.state, state, opts);
  res.cookies.set(CA_COOKIES.verifier, verifier, opts);
  return res;
}
