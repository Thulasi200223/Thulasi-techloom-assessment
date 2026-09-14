import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <div className="customer-page">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <CheckCircle
            size={80}
            color="#22c55e"
          />

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for your purchase.
            Your order has been placed successfully.
          </p>

          <button
            onClick={() => navigate("/shop")}
            style={{
              marginTop: "20px",
              padding: "14px 25px",
              border: "none",
              borderRadius: "10px",
              background: "#5b4cc4",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;