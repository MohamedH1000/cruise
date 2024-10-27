import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to access raw body
  },
};

const buffer = async (readable: any) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];

    // Retrieve the raw body
    const rawBody = await buffer(req);

    try {
      // Construct the Stripe event
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      console.log("Event constructed:", event);

      // Handle event types
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

      return res.status(200).json({ received: true });
    } catch (err: any) {
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
