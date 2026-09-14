import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: "💻",
      name: "Electronics",
      description: "Latest technology",
    },
    {
      icon: "📱",
      name: "Mobiles",
      description: "Smart devices",
    },
    {
      icon: "🎧",
      name: "Accessories",
      description: "Everything you need",
    },
    {
      icon: "⌚",
      name: "Wearables",
      description: "Smart lifestyle",
    },
  ];

  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and reliable delivery",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "Safe and protected checkout",
    },
    {
      icon: "📦",
      title: "Quality Products",
      description: "Products you can trust",
    },
    {
      icon: "💬",
      title: "Customer Support",
      description: "We're always here to help",
    },
  ];

  return (
    <div className="customer-page home-page">

      {/* HERO SECTION */}

      <section className="home-hero">

        <div className="hero-content">

          <div className="hero-badge">
            ⚡ SMART SHOPPING EXPERIENCE
          </div>

          <h1>
            Everything You Need.
            <br />

            <span>All in One Place.</span>
          </h1>

          <p>
            Discover quality products, manage your orders,
            and enjoy a simple, fast and secure shopping
            experience.
          </p>


          <div className="hero-buttons">

            <button
              className="hero-primary-btn"
              onClick={() => navigate("/shop")}
            >
              Start Shopping →
            </button>


            <button
              className="hero-secondary-btn"
              onClick={() => navigate("/cart")}
            >
              View My Cart
            </button>

          </div>


          <div className="hero-stats">

            <div>

              <strong>100+</strong>

              <span>Products</span>

            </div>


            <div>

              <strong>24/7</strong>

              <span>Support</span>

            </div>


            <div>

              <strong>100%</strong>

              <span>Secure</span>

            </div>

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="hero-visual">

          <div className="hero-glow"></div>


          <div className="hero-product-card card-one">

            <span className="hero-product-icon">
              💻
            </span>

            <div>

              <strong>
                Electronics
              </strong>

              <small>
                Latest Technology
              </small>

            </div>

          </div>


          <div className="hero-product-card card-two">

            <span className="hero-product-icon">
              📱
            </span>

            <div>

              <strong>
                Smart Devices
              </strong>

              <small>
                Best Deals Available
              </small>

            </div>

          </div>


          <div className="hero-main-icon">
            🛍️
          </div>


          <div className="floating-badge badge-one">
            ✓ Secure
          </div>

          <div className="floating-badge badge-two">
            ⚡ Fast Delivery
          </div>

        </div>

      </section>



      {/* CATEGORY SECTION */}

      <section className="home-section categories-section">

        <div className="section-heading">

          <span>
            SHOP BY CATEGORY
          </span>

          <h2>
            Find What You Love
          </h2>

          <p>
            Explore our popular product categories.
          </p>

        </div>


        <div className="categories-grid">

          {categories.map((category) => (

            <div
              className="category-card"
              key={category.name}
              onClick={() => navigate("/shop")}
            >

              <div className="category-icon">

                {category.icon}

              </div>


              <h3>
                {category.name}
              </h3>


              <p>
                {category.description}
              </p>


              <span className="category-arrow">
                →
              </span>

            </div>

          ))}

        </div>

      </section>



      {/* PROMOTION SECTION */}

      <section className="promo-section">

        <div className="promo-content">

          <span>
            LIMITED TIME OFFER
          </span>

          <h2>
            Shop Smarter.
            <br />

            Save More.
          </h2>

          <p>
            Discover amazing products and enjoy
            a smooth shopping experience.
          </p>


          <button
            onClick={() => navigate("/shop")}
          >
            Explore Products →
          </button>

        </div>


        <div className="promo-visual">

          <div className="promo-circle">

            <span>
              UP TO
            </span>

            <strong>
              30%
            </strong>

            <small>
              OFF
            </small>

          </div>

        </div>

      </section>



      {/* WHY CHOOSE US */}

      <section className="home-section features-section">

        <div className="section-heading">

          <span>
            WHY CHOOSE US
          </span>

          <h2>
            Shopping Made Simple
          </h2>

          <p>
            Everything you need for a better shopping
            experience.
          </p>

        </div>


        <div className="features-grid">

          {features.map((feature) => (

            <div
              className="feature-card"
              key={feature.title}
            >

              <div className="feature-icon">

                {feature.icon}

              </div>


              <h3>
                {feature.title}
              </h3>


              <p>
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </section>



      {/* CTA */}

      <section className="home-cta">

        <div>

          <span>
            READY TO START?
          </span>

          <h2>
            Find Your Next Favorite Product
          </h2>

          <p>
            Explore our collection and start shopping today.
          </p>

        </div>


        <button
          onClick={() => navigate("/shop")}
        >
          Shop Now →
        </button>

      </section>


      {/* FOOTER */}

      <footer className="customer-footer">

        <div>

          <h2>
            POS<span>FLOW</span>
          </h2>

          <p>
            A modern and secure shopping experience.
          </p>

        </div>


        <div className="footer-bottom">

          © 2026 POSFLOW. All rights reserved.

        </div>

      </footer>

    </div>
  );
}

export default Home;