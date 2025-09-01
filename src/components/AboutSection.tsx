import { Card } from "@/components/ui/card";
import foodCollage from "@/assets/food-collage.jpg";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-wine rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/6 w-48 h-48 bg-gold rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-6">
              {t("aboutSection.heading")}
            </h2>
            
            <Card className="glass-card p-8 shadow-elegant hover-lift animate-on-scroll">
              <p className="text-xl text-foreground/90 leading-relaxed mb-8 font-light">
                {t("aboutSection.description")}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-6 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl border border-gold/30 hover-glow group">
                  <div className="text-4xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform">
                    {t("aboutSection.stats.yearsExperience.value")}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t("aboutSection.stats.yearsExperience.label")}
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-wine/20 to-wine/5 rounded-xl border border-wine/30 hover-glow group">
                  <div className="text-4xl font-bold text-wine-light mb-2 group-hover:scale-110 transition-transform">
                    {t("aboutSection.stats.halalCertified.value")}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t("aboutSection.stats.halalCertified.label")}
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group animate-on-scroll delay-100">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                  <span className="text-black text-lg">🍕</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-gold transition-colors">{t("aboutSection.features.authItalianRecipes")}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group animate-on-scroll delay-200">
                <div className="w-12 h-12 bg-gradient-wine rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-warm">
                  <span className="text-white text-lg">🥙</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-wine-light transition-colors">{t("aboutSection.features.freshKebabs")}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group animate-on-scroll delay-300">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                  <span className="text-black text-lg">🚚</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-gold transition-colors">{t("aboutSection.features.fastDelivery")}</span>
              </div>
              <div className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group animate-on-scroll delay-400">
                <div className="w-12 h-12 bg-gradient-wine rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-warm">
                  <span className="text-white text-lg">⭐</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-wine-light transition-colors">{t("aboutSection.features.premiumQuality")}</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-on-scroll delay-100">
            <div className="relative overflow-hidden rounded-3xl shadow-elegant hover-lift group">
              <img 
                src={foodCollage} 
                alt={t("aboutSection.heading")}
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:from-black/40 transition-all duration-300"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="glass-card px-6 py-4 rounded-2xl hover-glow group/badge">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover/badge:animate-bounce">🏆</span>
                    <span className="text-gold font-bold text-lg">{t("aboutSection.features.badge")}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-gold/20 rounded-3xl -z-10 floating"></div>
            <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-wine/20 rounded-3xl -z-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
