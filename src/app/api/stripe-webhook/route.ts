import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  console.log("Stripe webhook received");

  try {
    // Retrieve the raw body as an ArrayBuffer and convert to Buffer
    const buf = Buffer.from(await req.arrayBuffer());
    console.log("Raw body received:", buf.toString());
    console.log("Headers received:", req.headers);
    const signature = req.headers.get("stripe-signature");

    // Construct the event using the buffer and signature
    const event = stripe.webhooks.constructEvent(
      buf,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservId = session?.metadata?.reservationId;

      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "active" },
      });
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const reservId = session?.metadata?.reservationId;

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
