import axios from "axios";
const url = "http://localhost:5000/api";
import styled from 'styled-components';

// Define your styled button component
const StripeButton = styled.button`
  /* Button styles */
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  background-color: #6772e5;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  /* Hover state */
  &:hover {
    background-color: #5563c1;
  }

  /* Active state */
  &:active {
    background-color: #4357ad;
  }

  /* Disabled state */
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  padding: 24px;
  font-family: sans-serif;

`
const PayButton = ({ cartItems }) => {
  const handleCheckout = () => {
    axios
      .post(`${url}/stripe/create-checkout-session`, {
        cartItems,
        userId: "1602140",
      })
      .then((response) => {
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <Container>
      <StripeButton onClick={() => handleCheckout()}>Check out</StripeButton>
    </Container>
  );
};

export default PayButton;
