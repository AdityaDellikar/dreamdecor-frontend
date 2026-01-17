// src/components/Hero/FloatingFrames.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ART = [
  { id: 1, src: "/assets/hero/art1.jpg" },
  { id: 2, src: "/assets/hero/art2.jpg" },
  { id: 3, src: "/assets/hero/art3.jpg" },
  { id: 4, src: "/assets/hero/art4.jpg" },
];

export default function FloatingFrames() {
  const framesRef = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // MOBILE: gentle idle float
    if (isTouch) {
      framesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? 14 : -14,
          duration: 4 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
      return;
    }

    // DESKTOP: cursor parallax
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX - window.innerWidth / 2;
      mouse.current.y = e.clientY - window.innerHeight / 2;

      framesRef.current.forEach((el, i) => {
        if (!el) return;
        const depth = (i + 1) * 0.015;
        gsap.to(el, {
          x: mouse.current.x * depth,
          y: mouse.current.y * depth,
          duration: 0.6,
          ease: "power3.out",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative grid grid-cols-2 gap-6">
      {ART.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => (framesRef.current[i] = el)}
          className="
            w-56 h-64
            rounded-xl overflow-hidden
            bg-white shadow-xl
            will-change-transform
          "
        >
          <img
            src={item.src}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}