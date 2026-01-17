import { motion, useTransform } from "framer-motion";
import { WALL_CONFIG } from "./wall.config";

export default function WallTypography({ progress }) {
  const opacity = useTransform(
    progress,
    [
      WALL_CONFIG.scrollTimings.decorFadeInStart - 0.15,
      WALL_CONFIG.scrollTimings.textFadeOutStart,
    ],
    [1, 0]
  );

  const y = useTransform(progress, [0, 0.4], [0, -40]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative z-20 h-full flex items-start justify-center text-center px-6 pt-[14vh]"
    >
      <div className="max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-serif text-[var(--midchar)] leading-tight">
          A wall doesn’t need paint.
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          Thoughtfully crafted metal art transforms empty spaces into
          statements of design.
        </p>
      </div>
    </motion.div>
  );
}