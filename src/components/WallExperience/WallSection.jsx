import { useRef } from "react";
import { useScroll } from "framer-motion";
import WallScene from "./WallScene";
import WallTypography from "./WallTypography";
import { WALL_CONFIG } from "./wall.config";

export default function WallSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      className="relative bg-[#F6F4F2]"
      style={{
        height:
          typeof window !== "undefined" && window.innerWidth < 768
            ? "160vh"
            : WALL_CONFIG.layout.containerHeight,
      }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden will-change-transform">
        <WallScene progress={scrollYProgress} />
        <WallTypography progress={scrollYProgress} />
      </div>
    </section>
  );
}