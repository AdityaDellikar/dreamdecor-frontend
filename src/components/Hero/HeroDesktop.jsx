// src/components/Hero/HeroDesktop.jsx
import HeroTypography from "./HeroTypography";
import FloatingFrames from "./FloatingFrames";

export default function HeroDesktop() {
  return (
    <section className="bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-10 py-28">
        <div className="grid grid-cols-2 gap-16 items-center">
          <HeroTypography />
          <FloatingFrames />
        </div>
      </div>
    </section>
  );
}