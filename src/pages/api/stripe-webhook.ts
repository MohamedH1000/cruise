import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendSuccessEmail } from "@/lib/utils/sendEmail";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];

  try {
    const rawBody = await buffer(req);
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservId = session.metadata?.reservationId as any;

      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "active" },
      });
      const customerEmail =
        session.customer_email || "mohammedhisham115@yahoo.com";

      await sendSuccessEmail(customerEmail, reservId);
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const reservId = session.metadata?.reservationId;

      await prisma.reservation.update({
        where: { id: reservId },
        data: { status: "failed" },
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

// Helper function to read the raw body as a buffer
import { Readable } from "stream";
function buffer(readable: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    readable.on("data", (chunk) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}
