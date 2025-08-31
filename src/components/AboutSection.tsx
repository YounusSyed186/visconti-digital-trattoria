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
            
            <Card className="bg-card/80 backdrop-blur-sm border-border p-8 shadow-elegant">
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                {t("aboutSection.description")}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <div className="text-2xl font-bold text-gold">
                    {t("aboutSection.stats.yearsExperience.value")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("aboutSection.stats.yearsExperience.label")}
                  </div>
                </div>
                <div className="text-center p-4 bg-wine/10 rounded-lg border border-wine/20">
                  <div className="text-2xl font-bold text-wine-light">
                    {t("aboutSection.stats.halalCertified.value")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("aboutSection.stats.halalCertified.label")}
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">🍕</span>
                </div>
                <span className="text-foreground">{t("aboutSection.features.authItalianRecipes")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-wine rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🥙</span>
                </div>
                <span className="text-foreground">{t("aboutSection.features.freshKebabs")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">🚚</span>
                </div>
                <span className="text-foreground">{t("aboutSection.features.fastDelivery")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-wine rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <span className="text-foreground">{t("aboutSection.features.premiumQuality")}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-elegant">
              <img 
                src={foodCollage} 
                alt={t("aboutSection.heading")}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 bg-gold text-black px-4 py-2 rounded-full font-semibold shadow-gold">
                {t("aboutSection.features.badge")}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-gold/30 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
