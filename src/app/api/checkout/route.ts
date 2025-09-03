import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment. Set it in server env (do not expose it to the client).");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function POST(req: NextRequest) {
  const { planId, userEmail } = await req.json();

  // Fetch plan details from Firestore (optional for demo)
  // const plan = await getPlan(planId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: "price_123", // Replace with your Stripe Price ID
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}