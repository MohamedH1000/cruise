import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

// Middleware to handle raw request body
function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(Buffer.from(data));
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const buf = await getRawBody(req);
  const signature = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkout Session completed:", session);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Error verifying webhook: ${err}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
