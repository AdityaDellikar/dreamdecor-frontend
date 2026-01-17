import { motion, useTransform, useMotionTemplate } from "framer-motion";

/**
 * MobileHeroStage
 * ----------------
 * Handles the floating frames background for MOBILE hero.
 * - Initial state: frames are blurred & slightly scaled down
 * - On scroll: frames scale up, sharpen, and come into focus
 * - Text (handled in HeroMobile) visually sits above initially
 */
export default function MobileHeroStage({ progress }) {
  // Zoom in frames slightly as user scrolls
  const scale = useTransform(progress, [0, 0.6], [0.9, 1]);

  // Remove blur as scroll progresses
  const blurValue = useTransform(progress, [0, 0.5], [16, 0]);
  const blur = useMotionTemplate`blur(${blurValue}px)`;

  // Subtle upward motion for cinematic feel
  const y = useTransform(progress, [0, 1], [40, 0]);

  // Opacity ramp: stay subtle behind text, then fully visible
  const opacity = useTransform(progress, [0, 0.25, 0.5], [0.35, 0.5, 1]);

  return (
    <motion.div
      style={{ scale, y, opacity }}
      className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
    >
      <motion.div
        style={{ filter: blur }}
        className="
          grid grid-cols-2 gap-4
          px-6
          max-w-sm
        "
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="
              rounded-2xl overflow-hidden
              bg-white shadow-xl
            "
          >
            <img
              src={`/assets/hero/art${i}.jpg`}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
