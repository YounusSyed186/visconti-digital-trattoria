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
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8 animate-on-scroll">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-gradient-gold mb-6 animate-glow leading-tight">
            {t("heroSection.title")}
          </h1>
          <div className="w-32 h-1 bg-gradient-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-2xl md:text-4xl font-light text-warm-white tracking-wider animate-on-scroll delay-100">
            {t("heroSection.subtitle")}
          </p>
        </div>

        <p className="text-xl md:text-2xl text-warm-white/90 mb-12 font-light leading-relaxed max-w-3xl mx-auto animate-on-scroll delay-200">
          {t("heroSection.tagline")}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-on-scroll delay-300">
          <Button 
            variant="premium"
            size="xl"
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-2xl group-hover:animate-bounce">🛵</span>
              {t("heroSection.orderOnline")}
            </span>
          </Button>
          <Button 
            variant="glass" 
            size="xl"
            onClick={() => navigate('/menuPhy')}
            className="border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold group"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl group-hover:scale-110 transition-transform">📋</span>
              {t("heroSection.viewMenu")}
            </span>
          </Button>
          <Button 
            variant="glass" 
            size="xl"
            onClick={() => navigate('/menu')}
            className="border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold group"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl group-hover:scale-110 transition-transform">📋</span>
              {t("heroSection.viewOnlineMenu")}
            </span>
          </Button>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-warm-white/80 animate-on-scroll delay-300">
          <span className="text-base font-medium">{t("heroSection.orderVia")}</span>
          <div className="flex gap-4">
            <span className="px-6 py-3 glass-card rounded-full text-sm font-medium hover-glow cursor-pointer group">
              <span className="flex items-center gap-2">
                <span className="group-hover:scale-110 transition-transform">📱</span>
                {t("heroSection.platforms.justEat")}
              </span>
            </span>
            <span className="px-6 py-3 glass-card rounded-full text-sm font-medium hover-glow cursor-pointer group">
              <span className="flex items-center gap-2">
                <span className="group-hover:scale-110 transition-transform">🛵</span>
                {t("heroSection.platforms.deliveroo")}
              </span>
            </span>
            <span className="px-6 py-3 glass-card rounded-full text-sm font-medium hover-glow cursor-pointer group">
              <span className="flex items-center gap-2">
                Glovo
              </span>
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
