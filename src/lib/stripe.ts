import Stripe from "stripe";

// Create a new instance of the Stripe client with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia", // Use the latest stable version
});
