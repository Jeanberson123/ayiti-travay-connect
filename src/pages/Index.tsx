
import { Hero } from "@/components/Hero";
import { SearchSection } from "@/components/SearchSection";
import { FeaturedJobs } from "@/components/FeaturedJobs";
import { HowItWorks } from "@/components/HowItWorks";
import { Stats } from "@/components/Stats";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <Hero />
      <SearchSection />
      <Stats />
      <FeaturedJobs />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
