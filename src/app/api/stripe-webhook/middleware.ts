import { NextResponse } from "next/server";

export function middleware(req: any) {
  const rawBody = req.body; // Capture the raw body

  req.rawBody = rawBody; // Make it available in the request

  return NextResponse.next(); // Continue to the next middleware or API route
}
