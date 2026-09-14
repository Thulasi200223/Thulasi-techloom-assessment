import { useEffect, useState } from "react";
import "./AnimatedBanner.css";

/* ✅ USE ONLY BANNER IMAGES */
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";

function AnimatedBanner() {
  const banners = [banner1, banner2, banner3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="animated-banner">
      <img src={banners[index]} alt="LankaFresh Promotion Banner" />
    </section>
  );
}

export default AnimatedBanner;
