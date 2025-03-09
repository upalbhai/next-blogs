import CategoriesSection from "@/components/CategoriesSection";
import FeaturedPosts from "@/components/FeaturedPosts";
import HeroSection from "@/components/HeroSection";
import NewsletterSection from "@/components/NewsLetterSection";

export default function Home() {
  return (
    <div className=" min-h-screen  font-[family-name:var(--font-geist-sans)]">
<HeroSection />
      <FeaturedPosts />
      <CategoriesSection />
      <NewsletterSection />
    </div>
  );
}
