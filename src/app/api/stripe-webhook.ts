import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const signature = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservId = session?.metadata.reservationId;

      // Update the reservation status to 'active' in the database
      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "active" },
      });
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const reservId = session?.metadata.reservationId;

      // Update the reservation status to 'failed' in the database
      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "failed" },
      });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
