import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { TrustBadges } from "@/components/home/TrustBadges";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts products={featured} />
      <CategoryTiles categories={categories} />
      <StoryTeaser />
      <Newsletter />
    </>
  );
}
