import { NextResponse, type NextRequest } from "next/server";
import { exchangeCode, setSession } from "@/lib/shopify/customer-account";
import { CA_COOKIES, isValidCallback, resolveOrigin } from "@/lib/shopify/customer-account-core";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const origin = resolveOrigin({ siteUrl: process.env.SITE_URL, headers: req.headers, fallbackProtocol: req.nextUrl.protocol });
  const fail = () => {
    const res = NextResponse.redirect(`${origin}/account?error=login`);
    res.cookies.delete(CA_COOKIES.state);
    res.cookies.delete(CA_COOKIES.verifier);
    return res;
  };
  const code = searchParams.get("code");
  const verifier = req.cookies.get(CA_COOKIES.verifier)?.value;
  const stored = { state: req.cookies.get(CA_COOKIES.state)?.value, verifier };
  if (!isValidCallback({ code, state: searchParams.get("state") }, stored)) return fail();

  const tokens = await exchangeCode(code!, verifier!, `${origin}/account/callback`);
  if (!tokens) return fail();

  await setSession(tokens);
  const res = NextResponse.redirect(`${origin}/account`);
  res.cookies.delete(CA_COOKIES.state);
  res.cookies.delete(CA_COOKIES.verifier);
  return res;
}
