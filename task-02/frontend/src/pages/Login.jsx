import { useEffect, useState } from "react";
import "../styles/auth.css";
import bakery from "../assets/brands/bakery.jpg";

function Login() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  useEffect(() => {
    console.log("Login page loaded");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    /* ================= ADMIN LOGIN ================= */
    if (isAdminLogin) {
      if (email === "admin@lankafresh.com" && password === "admin123") {
        localStorage.setItem("adminToken", "admin_logged_in");
        alert("Admin login successful");
        window.location.href = "/admin";
      } else {
        alert("Invalid admin credentials");
      }
      return;
    }

    /* ================= USER LOGIN ================= */
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("loggedUser", data.name);
      alert("Login successful");
      window.location.href = "/";
    } catch (err) {
      alert("Server not reachable");
      console.error(err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT IMAGE */}
        <div className="auth-image">
          <img src={bakery} alt="Groceries" />
        </div>

        {/* RIGHT FORM */}
        <div className="auth-form">
          <h2 className="brand">
            LankaFresh <span>MART</span>
          </h2>

          {/* ===== TABS ===== */}
          <div className="tabs">
            <span
              className={!isAdminLogin ? "active" : ""}
              onClick={() => setIsAdminLogin(false)}
              style={{ cursor: "pointer" }}
            >
              User Login
            </span>

            <span
              className={isAdminLogin ? "active" : ""}
              onClick={() => setIsAdminLogin(true)}
              style={{ cursor: "pointer" }}
            >
              Admin Login
            </span>
          </div>

          {/* ===== FORM ===== */}
          <form onSubmit={handleLogin} autoComplete="off">
            <input
              type="email"
              name="email"
              placeholder={isAdminLogin ? "Admin Email" : "Email"}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />

            <button type="submit">
              {isAdminLogin ? "ADMIN LOGIN" : "LOGIN"}
            </button>
          </form>

          {/* ===== SIGNUP LINK ONLY FOR USER ===== */}
          {!isAdminLogin && (
            <p style={{ marginTop: "10px" }}>
              Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
