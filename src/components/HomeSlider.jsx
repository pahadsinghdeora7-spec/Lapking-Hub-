import { useEffect, useState } from "react";
import "./homeSlider.css";

const banners = [
  "/banners/1.jpg",
  "/banners/2.jpg",
  "/banners/3.jpg",
];

export default function HomeSlider() {
  const [index, setIndex] = useState(0);

  // 🔒 SLIDER SPEED LOCKED
  const SLIDE_TIME = 4500; // 4.5 seconds (perfect speed)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, SLIDE_TIME);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-slider">
      <img
        src={banners[index]}
        alt="Lapking Hub Banner"
        className="slider-image"
      />
    </div>
  );
}
