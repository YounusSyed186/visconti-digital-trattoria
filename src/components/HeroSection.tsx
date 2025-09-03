import heroImage from "@/assets/Bg1.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    menuSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Decorative Pulses */}
      <div className="absolute top-1/4 left-1/4 w-20 sm:w-32 h-20 sm:h-32 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-wine/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-6 sm:mb-10 animate-on-scroll">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold text-gradient-gold mb-4 sm:mb-6 animate-glow leading-tight">
            {t("heroSection.title")}
          </h1>
          <div className="w-20 sm:w-32 h-1 bg-gradient-gold mx-auto mb-4 sm:mb-6 rounded-full"></div>
          <p className="text-lg sm:text-2xl md:text-3xl font-light text-warm-white tracking-wide animate-on-scroll delay-100">
            {t("heroSection.subtitle")}
          </p>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-warm-white/90 mb-8 sm:mb-12 font-light leading-relaxed max-w-2xl sm:max-w-3xl mx-auto animate-on-scroll delay-200">
          {t("heroSection.tagline")}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-on-scroll delay-300">
          <Button
            variant="premium"
            size="lg"
            className="w-full sm:w-auto group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
              <span className="text-xl sm:text-2xl group-hover:animate-bounce">
                🛵
              </span>
              {t("heroSection.orderOnline")}
            </span>
          </Button>

          <Button
            variant="glass"
            size="lg"
            onClick={() => navigate("/menuPhy")}
            className="w-full sm:w-auto border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold group"
          >
            <span className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">
                📋
              </span>
              {t("heroSection.viewMenu")}
            </span>
          </Button>

          <Button
            variant="glass"
            size="lg"
            onClick={() => navigate("/menu")}
            className="w-full sm:w-auto border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold group"
          >
            <span className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">
                📜
              </span>
              {t("heroSection.viewOnlineMenu")}
            </span>
          </Button>
        </div>

        {/* Order Platforms */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-warm-white/80 animate-on-scroll delay-300">
          <span className="text-sm sm:text-base font-medium">
            {t("heroSection.orderVia")}
          </span>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {["justEat", "deliveroo", "Glovo"].map((platform, idx) => (
              <span
                key={idx}
                className="px-4 sm:px-6 py-2 sm:py-3 glass-card rounded-full text-xs sm:text-sm font-medium hover-glow cursor-pointer group"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  {platform === "justEat" && (
                    <span className="group-hover:scale-110 transition-transform">
                      📱
                    </span>
                  )}
                  {platform === "deliveroo" && (
                    <span className="group-hover:scale-110 transition-transform">
                      🛵
                    </span>
                  )}
                  {platform}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
    </section>
  );
};

export default HeroSection;
