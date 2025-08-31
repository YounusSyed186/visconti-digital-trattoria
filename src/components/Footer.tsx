const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-bold text-gold mb-4">
              Visconti Pizzeria Kebab
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Authentic Italian pizza and halal kebabs in the heart of Pavia. 
              Fresh ingredients, traditional recipes, modern quality.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-wine rounded-full flex items-center justify-center hover:bg-wine-light transition-colors"
                aria-label="Facebook"
              >
                <span className="text-white text-sm">f</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gold rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors"
                aria-label="Instagram"
              >
                <span className="text-black text-sm">📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Link Rapidi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-gold transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/menu" className="text-muted-foreground hover:text-gold transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-gold transition-colors">
                  Contatti
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-gold transition-colors">
                  Offerte
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contatti</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p>Corso Cairoli 51</p>
                <p>Pavia, 27100</p>
              </div>
              <div>
                <a 
                  href="tel:+390382458734"
                  className="hover:text-gold transition-colors"
                >
                  +39 0382 458734
                </a>
              </div>
              <div>
                <p>Aperto tutti i giorni</p>
                <p className="text-gold">10:00 - 01:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Visconti Pizzeria Kebab. Tutti i diritti riservati.
          </p>
          
          {/* Order Online */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Ordina con:</span>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-gold text-black text-xs font-medium rounded-full">
                JustEat
              </span>
              <span className="px-3 py-1 bg-wine text-white text-xs font-medium rounded-full">
                Deliveroo
              </span>
            </div>
          </div>
        </div>

        {/* Special Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full">
            <span className="text-xs text-gold">🏆</span>
            <span className="text-xs text-gold font-medium">100% Halal Certified</span>
            <span className="text-xs text-gold">⭐</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;