import { NextRequest, NextResponse } from "next/server";
import { buffer } from "micro"; // Ensure you are using the correct import
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export const config = {
  api: { bodyParser: false }, // Deprecated in recent versions of Next.js
};

export async function POST(req: NextRequest) {
  console.log("stripe webhook received");

  // Get the raw body
  const body = await req.arrayBuffer();
  const buf = Buffer.from(body); // Convert ArrayBuffer to Buffer
  console.log("Raw body received:", buf.toString()); // Log the raw body for debugging

  const signature = headers().get("Stripe-Signature");
  console.log("Stripe signature received:", signature); // Log the received signature

  try {
    // Attempt to construct the event from the raw body and signature
    const event = stripe.webhooks.constructEvent(
      buf,
      signature!,
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