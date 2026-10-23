import { NextResponse, type NextRequest } from "next/server";
import { clearSession, refreshTokens, setSession } from "@/lib/shopify/customer-account";
import { CA_COOKIES, resolveOrigin } from "@/lib/shopify/customer-account-core";

export async function GET(req: NextRequest) {
  const origin = resolveOrigin({ siteUrl: process.env.SITE_URL, headers: req.headers, fallbackProtocol: req.nextUrl.protocol });
  const refresh = req.cookies.get(CA_COOKIES.refresh)?.value;
  const tokens = refresh ? await refreshTokens(refresh) : null;
  if (tokens) await setSession(tokens, refresh);
  else await clearSession();
  return NextResponse.redirect(`${origin}/account`);
}
