import heroImage from "@/assets/Bg1.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-wine/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gold mb-4 animate-glow">
            {t("heroSection.title")}
          </h1>
          <p className="text-2xl md:text-3xl font-light text-warm-white tracking-wider">
            {t("heroSection.subtitle")}
          </p>
        </div>

        <p className="text-xl md:text-2xl text-warm-white/90 mb-12 font-light leading-relaxed">
          {t("heroSection.tagline")}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-gold hover:bg-gold-dark text-black font-semibold px-8 py-4 text-lg shadow-gold hover:shadow-warm transition-all duration-300 transform hover:scale-105"
          >
            🛵 {t("heroSection.orderOnline")}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/menuPhy')}
            className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
          >
            📋 {t("heroSection.viewMenu")}
          </Button>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-warm-white/80">
          <span className="text-sm font-medium">{t("heroSection.orderVia")}</span>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
              {t("heroSection.platforms.justEat")}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
              {t("heroSection.platforms.deliveroo")}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
