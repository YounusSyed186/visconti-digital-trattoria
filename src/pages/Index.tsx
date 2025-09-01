import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LanguageToggle from "@/components/LanguageToggle";
import OfferBadgeFetcher from "@/components/offerBadge/OfferBadgefetch";
import ChefSection from "@/components/chefsection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <LanguageToggle />

      {/* Floating Offer Badge */}
        <OfferBadgeFetcher  />

      <HeroSection />
      <AboutSection />
      <MenuSection />
      <ContactSection />
      <ChefSection />
      <Footer />
    </div>

  );
};

export default Index;
