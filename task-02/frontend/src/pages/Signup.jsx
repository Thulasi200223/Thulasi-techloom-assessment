import "../styles/auth.css";
import bakeryImg from "../assets/brands/bakery.jpg";

function Signup() {

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful");
      window.location.href = "/login";

    } catch (err) {
      alert("Server not reachable");
      console.error(err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT IMAGE – bakery.jpg */}
        <div className="auth-image">
          <img src={bakeryImg} alt="Groceries" />
        </div>

        {/* RIGHT FORM */}
        <div className="auth-form">
          <h2 className="brand">
            LankaFresh <span>MART</span>
          </h2>

          <div className="tabs">
            <a href="/login">Login</a>
            <span className="active">Sign Up</span>
          </div>

          <form onSubmit={handleSignup} autoComplete="off">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">SIGN UP</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Signup;
