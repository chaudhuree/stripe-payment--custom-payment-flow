const express = require("express");
const Stripe = require("stripe");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, item) => {
    return acc + item.price * item.cartQuantity;
  }, 0);
  // console.log("total", total);

  return Math.round(total * 100) ;
};
router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // console.log("items: ", items);

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

module.exports = router;
