import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// Middleware to read the raw body
export async function POST(req: NextRequest) {
  console.log("Incoming request URL:", req.url);

  // Get the raw body as text
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf).toString();
  const sig = req.headers.get("stripe-signature");

  try {
    // Attempt to construct the event from the raw body and signature
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
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
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}
