import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*", "/((?!api/stripe-webhook).)*"], // This matches all other API routes if needed],
};

export function middleware(req: any) {
  const rawBody = req.body; // Capture the raw body

  req.rawBody = rawBody; // Make it available in the request

  return NextResponse.next(); // Continue to the next middleware or API route
}
