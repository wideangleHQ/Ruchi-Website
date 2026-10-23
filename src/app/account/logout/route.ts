import { NextResponse, type NextRequest } from "next/server";
import { clearSession, logoutUrl } from "@/lib/shopify/customer-account";
import { CA_COOKIES, resolveOrigin } from "@/lib/shopify/customer-account-core";

// Sign-out changes state, so it is POST-only: a plain link or image tag must not be able to log someone out.
export async function POST(req: NextRequest) {
  const origin = resolveOrigin({ siteUrl: process.env.SITE_URL, headers: req.headers, fallbackProtocol: req.nextUrl.protocol });
  const idToken = req.cookies.get(CA_COOKIES.idToken)?.value;
  await clearSession();
  // 303 so the browser follows with a GET to the end-session page.
  return NextResponse.redirect(await logoutUrl(idToken, `${origin}/account`), 303);
}

export function GET(req: NextRequest) {
  const origin = resolveOrigin({ siteUrl: process.env.SITE_URL, headers: req.headers, fallbackProtocol: req.nextUrl.protocol });
  return NextResponse.redirect(`${origin}/account`);
}
