const express = require("express");
const cors = require("cors");
const stripe = require("./routes/stripe");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/stripe", stripe);

app.get("/", (req, res) => {
  res.send("stripe payment api");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});
