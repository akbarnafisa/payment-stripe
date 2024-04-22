import { headers } from "next/headers";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(request: Request) {
  const payload = await request.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature") || "";
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error(error);
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }

  console.log("Event: ", event.type);

  if (event.type === "checkout.session.completed") {
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ["line_items"],
      }
    );

    const lineItems = sessionWithLineItems.line_items;

    // get user and credits from the metadata
    // const userId = sessionWithLineItems.metadata.userId;
    // const credits = sessionWithLineItems.metadata.credits;


    if (!lineItems) {
      return new Response("Internal server error", {
        status: 500,
      });
    }

    try {
      // save the data, get the customer info
      console.log("lines: ", lineItems!.data);
      console.log("event: ", event.data.object);
    } catch (error) {
      console.log(error);
    }
  }

  return new Response("Success!", {
    status: 200,
  });
}
