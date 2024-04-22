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
  console.log({ res });
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    payment_method_types: ["card"],
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
    return_url: `http://localhost:3000/react-modal-return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return Response.json({
    id: session.id,
    clientSecret: session.client_secret,
  });
}
