import { NextResponse } from "next/server";

export async function middleware(req: any) {
  // Only handle POST requests for the webhook
  if (req.method === "POST") {
    // Read the raw body as text
    const rawBody = await req.text();

    // Store the raw body in a property
    req["rawBody"] = rawBody;

    // Continue to the next middleware or route
    return NextResponse.next();
  }

  // Continue for non-POST requests
  return NextResponse.next();
}
