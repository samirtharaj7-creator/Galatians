import { HeroSection } from "@/components/hero-section";
import { preload } from "react-dom";

export default function HomePage() {
  preload("/assets/galatians-hero-engraving.webp?v=galatians-1", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high"
  });

  return (
    <main>
      <HeroSection />
    </main>
  );
}
