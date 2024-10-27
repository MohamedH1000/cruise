import { NextResponse } from "next/server";

export async function middleware(req: any) {
  if (req.method === "POST") {
    const rawBody = await req.text(); // Read the raw body as text
    req.rawBody = rawBody; // Attach the raw body to the request

    // Return the modified request
    return NextResponse.next();
  }
  return NextResponse.next(); // For other methods, just continue
}
