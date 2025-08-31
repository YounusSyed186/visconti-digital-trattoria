import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <ContactSection />
      <Footer />
    </div>
  );
}