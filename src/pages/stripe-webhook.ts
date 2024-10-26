// src/pages/api/stripe-webhook.ts
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro"; // Import `buffer` from `micro` for raw request body handling
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe"; // Your Stripe instance setup

// Disable Next.js automatic body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  let event;

  try {
    // Get the raw body for Stripe signature verification
    const buf = await buffer(req);
    const signature = req.headers["stripe-signature"] as string;

    event = stripe.webhooks.constructEvent(
      buf, // Raw request body
      signature, // Stripe signature from headers
      process.env.STRIPE_WEBHOOK_SECRET! // Your webhook secret
    );

    console.log("Stripe event received:", event);

    // Process the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const reservationId = session.metadata.reservationId;

      await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "active" },
      });

      console.log(`Reservation ${reservationId} set to active.`);
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as any;
      const reservationId = session.metadata.reservationId;

      await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "failed" },
      });

      console.log(`Reservation ${reservationId} set to failed.`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

export default handler;
