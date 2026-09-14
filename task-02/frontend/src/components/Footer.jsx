import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      {/* ===== DARK TOP FOOTER BAR ===== */}
      <div className="footer-top-bar">
        <h3>LankaFresh Mart</h3>
        <span>Fresh groceries delivered to your doorstep</span>
      </div>

      {/* ===== MAIN FOOTER BOXES ===== */}
      <div className="footer-top">

        <div className="footer-col">
          <h3>LankaFresh Mart</h3>
          <p>
            Sri Lanka’s trusted online grocery store.
            Fresh products delivered to your doorstep.
          </p>
          <p>📍 Colombo, Sri Lanka</p>
          <p>📧 support@lankafresh.lk</p>
          <p>📞 +94 11 234 5678</p>
        </div>

        <div className="footer-col">
          <h4>Useful Links</h4>
          <ul>
            <li>My Account</li>
            <li>Order History</li>
            <li>Help & Support</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Newsletter</h4>
          <p>Subscribe for offers & updates</p>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>

      </div>

      {/* ===== FOOTER BOTTOM ===== */}
      <div className="footer-bottom">
        <p>© 2025 LankaFresh Mart. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
