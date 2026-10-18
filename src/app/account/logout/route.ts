import { NextResponse, type NextRequest } from "next/server";
import { CA_COOKIES, clearSession, logoutUrl } from "@/lib/shopify/customer-account";

export async function GET(req: NextRequest) {
  const idToken = req.cookies.get(CA_COOKIES.idToken)?.value;
  await clearSession();
  return NextResponse.redirect(await logoutUrl(idToken, `${req.nextUrl.origin}/account`));
}
