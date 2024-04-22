"use client";

export default function Home() {
  const handleCheckout = () => {
    fetch("/api/create-checkout-session", {
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
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok");
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        Stripe Payment
      </div>
      <a href="https://buy.stripe.com/test_cN2g1u32L9cF9bi288" target="_blank">
        buy now
      </a>
      <button
        onClick={handleCheckout}
        className="bg-white border-gray-300 rounded-sm text-black px-4 py-2 mt-4"
      >
        checkout
      </button>
    </main>
  );
}
