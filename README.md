# backend code for stripe payment

- go to stripe website and create an account
- collect public and private api keys
- setup backend with node js
- install stripe package

- write code in stripe.js route

- for necessary information go to stripe website -
<a href="https://stripe.com/docs/payments/quickstart">documentation</a>

- in the route file code this text

```js
const express = require("express");
const app = express();
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51NRJ7VBhBYaeHe6cQlo6YHpD9kcHmVRmDG95n48PFyBpcWKi5BTGLW46twI5pgtHu2qW3mbyxXJAzSMiyoH7xZcw00OGrRzlMI');

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  // note: from fontend cart items is sent by website. so then we will calculate value from that. it is done in the client side folder
  // till then we will use this static value and payment will be always 1400
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(5000, () => console.log("Node server listening on port 4242!"));
```

## client side code starts from here:
- create a component for the form named CheckoutForm.jsx
- add some style in the App.css and attatch it to the App.jsx
- code for CheckoutForm.jsx
- create a page for success message named CheckoutSuccess.jsx

```js
import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:5173/checkout-success",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.target.value)}
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
```

- now finally it is time to code in Cart.jsx
```js
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

```

- here as cart products i have used dummy data and with this the total value will be counted in backend.

```js
const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, item) => {
    return acc + item.price * item.cartQuantity;
  }, 0);
  // console.log("total", total);

  return Math.round(total * 100) ;
};
```

- now from the cart page when user click on the checkout button it will redirect to the stripe checkout page
- after payment it will redirect to the success page
- from the success page i have redirected the user to the cart page again after 3sec of interval
