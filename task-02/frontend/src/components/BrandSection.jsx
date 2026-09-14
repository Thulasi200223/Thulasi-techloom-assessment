import "../components/BrandSection.css";

import maliban from "../assets/brands/maliban.png";
import babycheramy from "../assets/brands/babycheramy.png";
import magic from "../assets/brands/magic.png";
import kotmale from "../assets/brands/kotmale.png";
import kist from "../assets/brands/kist.png";
import munchee from "../assets/brands/munchee.png";
import surfexcel from "../assets/brands/surfexcel.png";
import ceylon1844 from "../assets/brands/ceylon1844.png";

function BrandSection() {
  const brands = [
    { name: "Maliban", img: maliban, slug: "maliban" },
    { name: "Baby Cheramy", img: babycheramy, slug: "babycheramy" },
    { name: "Magic", img: magic, slug: "magic" },
    { name: "Kotmale", img: kotmale, slug: "kotmale" },
    { name: "Kist", img: kist, slug: "kist" },
    { name: "Munchee", img: munchee, slug: "munchee" },
    { name: "Surf Excel", img: surfexcel, slug: "surfexcel" },
    { name: "Ceylon 1844", img: ceylon1844, slug: "ceylon1844" }
  ];

  const goBrand = (brand) => {
    window.location.href = `/products?brand=${brand}`;
  };

  return (
    <section className="brand-section">
      <h2>Shop by Brand</h2>

      <div className="brand-grid">
        {brands.map((b, i) => (
          <div key={i} className="brand-item" onClick={() => goBrand(b.slug)}>
            <div className="brand-circle">
              <img src={b.img} alt={b.name} />
            </div>
            <p>{b.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandSection;
