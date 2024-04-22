import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(request: Request) {

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });
    return Response.json({  clientSecret: paymentIntent.client_secret, });

  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }
}
