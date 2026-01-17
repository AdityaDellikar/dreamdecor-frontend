import { motion, useTransform } from "framer-motion";
import { WALL_CONFIG } from "./wall.config";

import emptyWall from "../../assets/wall/empty-wall2.jpg";

import decor1 from "../../assets/wall/decor.png";
import decor2 from "../../assets/wall/decor2.png";
import decor3 from "../../assets/wall/decor3.png";

const DECORS = [decor1, decor2, decor3];

export default function WallScene({ progress }) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const bgScale = useTransform(
    progress,
    [0, 0.5],
    isMobile ? [1.05, 1] : [1.15, 1]
  );

  const decorY = useTransform(
    progress,
    [
      WALL_CONFIG.scrollTimings.decorFadeInStart,
      WALL_CONFIG.scrollTimings.decorFadeInEnd,
    ],
    isMobile ? [20, 0] : [40, 0]
  );

  const decorScale = useTransform(progress, [0.35, 0.6], [0.92, 1]);

  // Sequential decor fades (one at a time)
  const decor1Opacity = useTransform(
    progress,
    [0.25, 0.4, 0.5],
    [0, 1, 0]
  );

  const decor2Opacity = useTransform(
    progress,
    [0.45, 0.6, 0.7],
    [0, 1, 0]
  );

  const decor3Opacity = useTransform(
    progress,
    [0.65, 0.9],
    [0, 1]
  );

  const decorX = useTransform(
    progress,
    [0.35, 0.6],
    isMobile ? [-4, 0] : [-12, 0]
  );
//   const decorBlur = useTransform(
//     progress,
//     [0.3, 0.5],
//     ["blur(4px)", "blur(0px)"]
//   );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Background wall */}
      <motion.img
        src={emptyWall}
        alt="Empty wall"
        style={{ scale: bgScale }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Ambient wall lighting */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.18)_100%)]" />

      {/* Decor layer 1 */}
      <motion.img
        src={DECORS[0]}
        alt="Wall decor design 1"
        style={{
          opacity: decor1Opacity,
          y: decorY,
          x: decorX,
          scale: decorScale,
        //   filter: decorBlur,
        }}
        className="absolute z-[10] w-[60vw] md:w-[36vw] max-w-[520px] top-[28%] md:top-[18%] object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.28)]"
        draggable={false}
      />

      {/* Decor layer 2 */}
      <motion.img
        src={DECORS[1]}
        alt="Wall decor design 2"
        style={{
          opacity: decor2Opacity,
          y: decorY,
          x: decorX,
          scale: decorScale,
        //   filter: decorBlur,
        }}
        className="absolute z-[11] w-[60vw] md:w-[36vw] max-w-[520px] top-[28%] md:top-[18%] object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.28)]"
        draggable={false}
      />

      {/* Decor layer 3 */}
      <motion.img
        src={DECORS[2]}
        alt="Wall decor design 3"
        style={{
          opacity: decor3Opacity,
          y: decorY,
          x: decorX,
          scale: decorScale,
        //   filter: decorBlur,
        }}
        className="absolute z-[12] w-[60vw] md:w-[36vw] max-w-[520px] top-[28%] md:top-[18%] object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.28)]"
        draggable={false}
      />
    </div>
  );
}