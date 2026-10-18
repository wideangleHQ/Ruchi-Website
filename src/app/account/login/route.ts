import { NextResponse, type NextRequest } from "next/server";
import { buildAuthorizeUrl, CA_COOKIES, clientId } from "@/lib/shopify/customer-account";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  if (!clientId()) return NextResponse.redirect(`${origin}/account?error=config`);
  const { url, state, verifier } = await buildAuthorizeUrl(`${origin}/account/callback`);
  const res = NextResponse.redirect(url);
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 600 };
  res.cookies.set(CA_COOKIES.state, state, opts);
  res.cookies.set(CA_COOKIES.verifier, verifier, opts);
  return res;
}
