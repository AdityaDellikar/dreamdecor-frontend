// src/components/Hero/HeroTypography.jsx
import { motion } from "framer-motion";

export default function HeroTypography() {
  return (
    <div className="
      relative z-10
      max-w-xl
      space-y-5
      text-center
      md:text-left
    ">
      <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[var(--brownline)]">
        Crafted Wall Decor
      </p>

      <h1 className="text-[28px] md:text-[42px] font-medium leading-[1.15] text-gray-900">
        Elevate your walls with
      </h1>

      <h2 className="
        relative inline-block
        font-serif italic
        text-[32px] md:text-[46px]
        leading-[1.15]
        text-[var(--brand)]
      ">
        Premium CNC Metal Art

        {/* Infinite shimmer underline (restored) */}
        <motion.span
          initial={{ backgroundPositionX: "200%" }}
          animate={{ backgroundPositionX: "-200%" }}
          transition={{
            duration: 2.5,
            ease: "linear",
            repeat: Infinity,
          }}
          className="
            absolute left-0 -bottom-2
            w-full h-[2px]
            bg-[length:200%_100%]
            bg-gradient-to-r
            from-transparent
            via-[var(--accent)]
            to-transparent
          "
        />
      </h2>

      <p className="pt-3 text-gray-600 text-[15px] md:text-lg leading-relaxed">
        Thoughtfully designed wall decor that blends craftsmanship,
        architecture, and modern interiors into timeless statements.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-5">
        <a
          href="/products"
          className="px-8 py-4 bg-black text-white rounded-full"
        >
          Explore Collection →
        </a>

        <span className="text-[12px] text-gray-500 tracking-wide">
          Handcrafted • Made in India
        </span>
      </div>
    </div>
  );
}