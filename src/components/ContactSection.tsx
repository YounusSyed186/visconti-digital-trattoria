import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-dark relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-wine rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-4">
            {t("contactSection.heading")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("contactSection.subheading")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <Card className="glass-card shadow-elegant hover-lift animate-on-scroll">
              <CardContent className="p-10">
                <h3 className="text-3xl font-serif font-semibold text-gradient-gold mb-8 border-animated">
                  {t("contactSection.contactInfo.title")}
                </h3>

                <div className="space-y-8">
                  {/* Address */}
                  <div className="flex items-start space-x-5 p-4 glass-card rounded-xl hover-glow group">
                    <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center flex-shrink-0 shadow-gold group-hover:scale-110 transition-transform">
                      <span className="text-black text-xl">📍</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-2 text-lg group-hover:text-gold transition-colors">
                        {t("contactSection.contactInfo.address.label")}
                      </h4>
                      <p className="text-muted-foreground text-base leading-relaxed">{t("contactSection.contactInfo.address.value")}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-5 p-4 glass-card rounded-xl hover-glow group">
                    <div className="w-14 h-14 bg-gradient-wine rounded-xl flex items-center justify-center flex-shrink-0 shadow-warm group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl">📞</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-2 text-lg group-hover:text-wine-light transition-colors">
                        {t("contactSection.contactInfo.phone.label")}
                      </h4>
                      <div className="relative group/phone">
                        <a href="tel:+390382458734" className="text-gold hover:text-gold-dark transition-colors font-semibold text-lg relative">
                          {t("contactSection.contactInfo.phone.value")}
                          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold scale-x-0 group-hover/phone:scale-x-100 transition-transform origin-left"></span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-5 p-4 glass-card rounded-xl hover-glow group">
                    <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center flex-shrink-0 shadow-gold group-hover:scale-110 transition-transform">
                      <span className="text-black text-xl">🕙</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-2 text-lg group-hover:text-gold transition-colors">
                        {t("contactSection.contactInfo.hours.label")}
                      </h4>
                      <p className="text-muted-foreground text-base leading-relaxed">{t("contactSection.contactInfo.hours.value")}</p>
                    </div>
                  </div>
                </div>

                {/* Order Buttons */}
                <div className="mt-10 pt-8 border-t border-gold/20">
                  <h4 className="font-bold text-foreground mb-6 text-lg">{t("contactSection.contactInfo.orderOnline.title")}</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="gold" size="lg" className="flex-1 group">
                      <span className="flex items-center gap-3">
                        <span className="text-xl group-hover:animate-bounce">📱</span>
                        {t("contactSection.contactInfo.orderOnline.justEat")}
                      </span>
                    </Button>
                    <Button variant="wine" size="lg" className="flex-1 group">
                      <span className="flex items-center gap-3">
                        <span className="text-xl group-hover:animate-bounce">🛵</span>
                        {t("contactSection.contactInfo.orderOnline.deliveroo")}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold/20 to-gold/5 border-gold/40 backdrop-blur-sm hover-glow animate-on-scroll delay-100">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold floating">
                    <span className="text-black text-lg">🚚</span>
                  </div>
                  <h4 className="font-bold text-gold text-lg">{t("contactSection.contactInfo.freeDelivery.title")}</h4>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed">
                  {t("contactSection.contactInfo.freeDelivery.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Map & Directions */}
          <div className="relative animate-on-scroll delay-200">
            <Card className="overflow-hidden shadow-elegant hover-lift group">
              <div className="relative h-[500px] bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2804.841922827158!2d9.156059315524!3d45.18414447909842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c7663e9d1c3f%3A0x123456789!2sCorso%20Cairoli%2051%2C%2027100%20Pavia%20PV%2C%20Italy!5e0!3m2!1sen!2sit!4v1234567890123!5m2!1sen!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("contactSection.heading")}
                  className="grayscale-[30%] hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none group-hover:from-black/10 transition-all duration-300"></div>
              </div>
            </Card>
            <div className="absolute bottom-6 right-6">
              <Button 
                variant="glass"
                size="lg"
                className="group/btn hover-glow shadow-elegant"
                onClick={() => window.open('https://maps.google.com?q=Corso+Cairoli+51,+Pavia,+Italy', '_blank')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg group-hover/btn:animate-bounce">🧭</span>
                  {t("contactSection.contactInfo.directions")}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
