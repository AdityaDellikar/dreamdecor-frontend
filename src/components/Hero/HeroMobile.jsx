// src/components/Hero/HeroMobile.jsx
import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import MobileHeroStage from "./MobileHeroStage";
import HeroTypography from "./HeroTypography";

export default function HeroMobile() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Text fades & blurs as frames come forward
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.2]);
  const textBlur = useTransform(
    scrollYProgress,
    [0, 0.35],
    ["blur(0px)", "blur(10px)"]
  );
  const textScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.96]);

  // Frames come forward as text fades back
  const stageScale = useTransform(scrollYProgress, [0.15, 0.55], [0.92, 1]);
  const stageBlur = useTransform(
    scrollYProgress,
    [0, 0.25],
    ["blur(8px)", "blur(0px)"]
  );

  return (
    <section
      ref={ref}
      className="relative h-[160vh] bg-[var(--cream)]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center">
        {/* Visual / frames layer */}
        <motion.div
          style={{
            scale: stageScale,
            filter: stageBlur,
          }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <MobileHeroStage progress={scrollYProgress} />
        </motion.div>

        {/* Text layer */}
        <motion.div
          style={{
            opacity: textOpacity,
            scale: textScale,
            filter: textBlur,
          }}
          className="
            relative z-30
            flex items-center justify-center
            text-center
            max-w-[92vw]
            pointer-events-auto
          "
        >
          <HeroTypography />
        </motion.div>
      </div>
    </section>
  );
}