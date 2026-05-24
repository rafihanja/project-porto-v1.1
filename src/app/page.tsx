import { ComparisonSection } from "@/components/ComparisonSection";
import { Footer } from "@/components/Footer";
import { HeroCalculator } from "@/components/HeroCalculator";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { SourceSection } from "@/components/SourceSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroCalculator />
        <ComparisonSection />
        <HowItWorks />
        <SourceSection />
      </main>
      <Footer />
    </>
  );
}
