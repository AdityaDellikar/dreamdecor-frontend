import React, { useEffect, useRef } from "react";

export default function FloatingFrames({
  intensity = 8,
  idleAmp = 4,
}) {
  const containerRef = useRef(null);
  const frameRefs = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  // Linear interpolation
  const lerp = (a, b, n) => (1 - n) * a + n * b;

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX - window.innerWidth / 2;
      mouse.current.y = e.clientY - window.innerHeight / 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      current.current.x = lerp(
        current.current.x,
        mouse.current.x,
        0.08
      );
      current.current.y = lerp(
        current.current.y,
        mouse.current.y,
        0.08
      );

      frameRefs.current.forEach((el, i) => {
        if (!el) return;
        const factor = (i + 1) / frameRefs.current.length;

        const x =
          current.current.x * intensity * factor * 0.02;
        const y =
          current.current.y * intensity * factor * 0.02;

        el.style.transform = `
          translate3d(${x}px, ${y}px, 0)
        `;
      });

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full pointer-events-none"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => (frameRefs.current[i] = el)}
          className="
            absolute inset-0
            flex items-center justify-center
            will-change-transform
          "
          style={{
            transition: "transform 0.1s linear",
          }}
        >
          <img
            src={`/assets/hero/frame-${i + 1}.png`}
            alt=""
            className="w-72 md:w-80 lg:w-96 rounded-2xl shadow-xl"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}