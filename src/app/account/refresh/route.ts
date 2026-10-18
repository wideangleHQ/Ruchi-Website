import { NextResponse, type NextRequest } from "next/server";
import { CA_COOKIES, clearSession, refreshTokens, setSession } from "@/lib/shopify/customer-account";

export async function GET(req: NextRequest) {
  const refresh = req.cookies.get(CA_COOKIES.refresh)?.value;
  const tokens = refresh ? await refreshTokens(refresh) : null;
  if (tokens) await setSession(tokens, refresh);
  else await clearSession();
  return NextResponse.redirect(`${req.nextUrl.origin}/account`);
}
