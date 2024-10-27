import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const config = {
  api: {
    bodyParser: false, // Disables automatic body parsing
  },
};

export async function POST(req: any) {
  const sig = req.headers.get("stripe-signature");

  try {
    // Read raw body as a buffer to maintain its integrity
    const rawBody = await req.arrayBuffer();
    const bodyBuffer = Buffer.from(rawBody);

    // Verify signature and construct event
    const event = stripe.webhooks.constructEvent(
      bodyBuffer,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Process Stripe event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservId = session.metadata?.reservationId;

      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "active" },
      });
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const reservId = session.metadata?.reservationId;

      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "failed" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}
