import { NextRequest } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("session_id") || "";

  const session = await stripe.checkout.sessions.retrieve(query);

  return Response.json({
    status: session.status,
    customer_email: session.customer_details?.email,
  });
}
