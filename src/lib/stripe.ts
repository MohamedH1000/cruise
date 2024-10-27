import Stripe from "stripe";

// Create a new instance of the Stripe client with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16" as Stripe.LatestApiVersion, // Use the latest stable version
});
