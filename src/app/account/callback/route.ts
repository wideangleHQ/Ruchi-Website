import { NextResponse, type NextRequest } from "next/server";
import { CA_COOKIES, exchangeCode, setSession } from "@/lib/shopify/customer-account";

export async function GET(req: NextRequest) {
  const { origin, searchParams } = req.nextUrl;
  const fail = NextResponse.redirect(`${origin}/account?error=login`);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const verifier = req.cookies.get(CA_COOKIES.verifier)?.value;
  if (!code || !verifier || state !== req.cookies.get(CA_COOKIES.state)?.value) return fail;

  const tokens = await exchangeCode(code, verifier, `${origin}/account/callback`);
  if (!tokens) return fail;

  await setSession(tokens);
  const res = NextResponse.redirect(`${origin}/account`);
  res.cookies.delete(CA_COOKIES.state);
  res.cookies.delete(CA_COOKIES.verifier);
  return res;
}
