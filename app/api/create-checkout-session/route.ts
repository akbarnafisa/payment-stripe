import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const itemsStore = new Map([
  [1, { price: 100, name: "Apple" }],
  [2, { price: 200, name: "Banana" }],
  [3, { price: 300, name: "Cherry" }],
]);

export async function POST(request: Request) {
  const res = await request.json();
  console.log({
    request: request.url,
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // get the price ID from stripe dashboard
    // line_items: [{
    //   price: 'price_1P7XDPHFzBy5sk1QBtxSoD3X',
    //   quantity: 1,
    // }],
    metadata: {
      // credits,
      // userId,
    },
    // @ts-ignore
    line_items: res.items.map((item) => {
      const storeItem = itemsStore.get(item.id);
      if (!storeItem) {
        throw new Error(`Item not found: ${item.id}`);
      }
      return {
        price_data: {
          currency: "usd",
          // check data to db if it is correct
          product_data: {
            name: storeItem.name,
          },
          unit_amount: storeItem.price,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/fail`,
  });

  return Response.json({ url: session.url });
}
