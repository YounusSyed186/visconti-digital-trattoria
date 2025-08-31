import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-bold text-gold mb-4">
              {t("footer.brand.name")}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t("footer.brand.description")}
            </p>

            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-wine rounded-full flex items-center justify-center hover:bg-wine-light transition-colors" aria-label="Facebook">
                <span className="text-white text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gold rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors" aria-label="Instagram">
                <span className="text-black text-sm">📷</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.quickLinks.title")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.quickLinks.home")}</a></li>
              <li><a href="/menu" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.quickLinks.menu")}</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.quickLinks.contact")}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.quickLinks.offers")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.contactInfo.title")}</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p>{t("footer.contactInfo.address")}</p>
              </div>
              <div>
                <a href="tel:+390382458734" className="hover:text-gold transition-colors">{t("footer.contactInfo.phone")}</a>
              </div>
              <div>
                <p>{t("footer.contactInfo.hours")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">© {currentYear} {t("footer.brand.name")}. Tutti i diritti riservati.</p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{t("footer.orderOnline")}</span>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-gold text-black text-xs font-medium rounded-full">JustEat</span>
              <span className="px-3 py-1 bg-wine text-white text-xs font-medium rounded-full">Deliveroo</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full">
            <span className="text-xs text-gold">🏆</span>
            <span className="text-xs text-gold font-medium">{t("footer.certificationBadge")}</span>
            <span className="text-xs text-gold">⭐</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
