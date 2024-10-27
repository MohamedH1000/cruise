import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const config = {
  api: { bodyParser: false }, // Only needed in /pages/api
};

export async function POST(req: NextRequest) {
  console.log("stripe webhook received");

  // Get the raw body
  const body = await req.arrayBuffer(); // Fetch the raw body as ArrayBuffer
  const buf = Buffer.from(body); // Convert ArrayBuffer to Buffer
  const sig = req.headers.get("stripe-signature");

  try {
    // Attempt to construct the event from the raw body and signature
    const event = stripe.webhooks.constructEvent(
      buf,
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
