import { Categories } from "@/components/categories";
import { Explore } from "@/components/explore";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { PopularServices } from "@/components/popular-services";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <Features />
      <Explore />
      <PopularServices />
    </div>
  );
}
