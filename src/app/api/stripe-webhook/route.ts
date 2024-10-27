import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: any) {
  console.log("Incoming request URL:", req.url);

  // Access the raw body set by the middleware
  const rawBody = req.rawBody; // This should now be populated
  const sig = req.headers.get("stripe-signature");

  if (!rawBody) {
    return NextResponse.json(
      { error: "No raw body available for signature verification" },
      { status: 400 }
    );
  }

  try {
    // Construct the event from the raw body and signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Event constructed:", event); // Log the constructed event

    // Handle the event as needed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservId = session?.metadata?.reservationId;

      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "active" },
      });
      console.log(`Reservation ${reservId} set to active.`);
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const reservId = session?.metadata?.reservationId;

      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "failed" },
      });
      console.log(`Reservation ${reservId} set to failed.`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "This endpoint is for POST requests only.",
  });
}
