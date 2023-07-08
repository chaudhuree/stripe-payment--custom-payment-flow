import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";

import CheckoutForm from "./CheckoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51NRJ7VBhBYaeHe6cSOm8ypnr9Slz7M1sJH07ex9FLDVaKAS6XM8ZZhzOBN3ee1qqOJ8uTL9NMpLFbpmB0E5YEBwR00g8gMSGV5"
);

export default function Cart() {
  const [clientSecret, setClientSecret] = useState("");
  const cartItems = [
    {
      brand: "Nike",
      cartQuantity: 2,
      desc: "Running shoes for men",
      id: 1,
      image:
        "https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Nike Air Zoom Pegasus",
      price: 99.99,
    },
    {
      brand: "Adidas",
      cartQuantity: 1,
      desc: "Sneakers for women",
      id: 2,
      image:
        "https://images.pexels.com/photos/1031955/pexels-photo-1031955.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Adidas Ultraboost",
      price: 129.99,
    },
    {
      brand: "Puma",
      cartQuantity: 3,
      desc: "Casual shoes for kids",
      id: 3,
      image:
        "https://images.pexels.com/photos/12511453/pexels-photo-12511453.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Puma Smash v2",
      price: 49.99,
    },
  ];
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:5000/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
