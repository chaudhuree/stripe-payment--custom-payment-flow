import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./components/Cart";
import NotFound from "./components/NotFound";
import CheckoutSuccess from "./components/CheckoutSuccess";
import "./App.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
