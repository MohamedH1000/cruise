import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const signature = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(buf, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservId = session.metadata.reservationId
      await fetch("/api/reservation", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservId, "active" }),
      });
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const reservId = session.metadata.reservationId
      await fetch("/api/reservation", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservId, "failed" }),
      });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}