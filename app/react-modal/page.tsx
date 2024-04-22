// https://docs.stripe.com/checkout/embedded/quickstart
"use client";
import { useCallback, useEffect, useState } from "react";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/config").then(async (r) => {
      const { publishableKey } = await r.json();
      if (!publishableKey) {
        console.error("Stripe publishable key not found");
        return;
      }
      // @ts-ignore
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/embedded-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            quantity: 3,
          },
          {
            id: 2,
            quantity: 1,
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  return (
    <div>
      <h1>React Stripe and the Payment Element</h1>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
        }}
      >
        {/* <CheckoutForm /> */}
        <EmbeddedCheckout id="payment-element" />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default Payment;
