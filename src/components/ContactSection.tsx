import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-dark relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-wine rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-4">
            Contatti & Posizione
          </h2>
          <p className="text-xl text-muted-foreground">
            Vieni a trovarci nel cuore di Pavia
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-elegant">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-semibold text-gold mb-6">
                  Informazioni di Contatto
                </h3>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black text-lg">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Indirizzo</h4>
                      <p className="text-muted-foreground">
                        Corso Cairoli 51<br/>
                        Pavia, 27100, Italy
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-wine rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Telefono</h4>
                      <a 
                        href="tel:+390382458734" 
                        className="text-gold hover:text-gold-dark transition-colors font-medium"
                      >
                        +39 0382 458734
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black text-lg">🕙</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Orari di Apertura</h4>
                      <p className="text-muted-foreground">
                        Tutti i giorni: 10:00 - 01:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Buttons */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-4">Ordina Online</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-gradient-gold hover:bg-gold-dark text-black font-semibold shadow-gold flex-1">
                      📱 JustEat
                    </Button>
                    <Button className="bg-gradient-wine hover:bg-wine text-white font-semibold shadow-warm flex-1">
                      🛵 Deliveroo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Delivery Info */}
            <Card className="bg-gold/10 border-gold/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-black text-sm">🚚</span>
                  </div>
                  <h4 className="font-semibold text-gold">Consegna Gratuita</h4>
                </div>
                <p className="text-sm text-foreground/80">
                  Consegna gratuita per ordini superiori a €8<br/>
                  Sotto €8, costo di consegna solo €2
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="relative">
            <Card className="overflow-hidden shadow-elegant">
              <div className="relative h-96 bg-muted">
                {/* Placeholder map - in a real app, you'd use Google Maps or similar */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2804.841922827158!2d9.156059315524!3d45.18414447909842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c7663e9d1c3f%3A0x123456789!2sCorso%20Cairoli%2051%2C%2027100%20Pavia%20PV%2C%20Italy!5e0!3m2!1sen!2sit!4v1234567890123!5m2!1sen!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Visconti Pizzeria Kebab Location"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                ></iframe>
                
                {/* Map overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                
                {/* Location marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-6 h-6 bg-gold rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full"></div>
                </div>
              </div>
            </Card>
            
            {/* Directions button */}
            <div className="absolute bottom-4 right-4">
              <Button 
                size="sm"
                className="bg-gold hover:bg-gold-dark text-black font-medium shadow-gold"
                onClick={() => window.open('https://maps.google.com?q=Corso+Cairoli+51,+Pavia,+Italy', '_blank')}
              >
                🧭 Indicazioni
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;