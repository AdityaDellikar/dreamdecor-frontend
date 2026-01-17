import Hero from "../Hero/Hero";
import WallSection from "../WallExperience/WallSection";
import FeaturedProducts from "./FeaturedProducts";
import BentoFeatures from "../BentoFeatures";

export default function Home() {
  return (
    <>
      <Hero />
      <WallSection />
      <BentoFeatures />
      <FeaturedProducts />
    </>
  );
}