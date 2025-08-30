import { Card } from "@/components/ui/card";
import foodCollage from "@/assets/food-collage.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-wine rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/6 w-48 h-48 bg-gold rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-6">
              Benvenuti a Visconti
            </h2>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border p-8 shadow-elegant">
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                Visconti Pizzeria Kebab brings together the timeless flavors of Italy with the authentic taste of kebabs. Located in the heart of Pavia, we serve fresh, Halal-certified pizzas, kebabs, panini, and more — all crafted with passion and tradition.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <div className="text-2xl font-bold text-gold">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-wine/10 rounded-lg border border-wine/20">
                  <div className="text-2xl font-bold text-wine-light">100%</div>
                  <div className="text-sm text-muted-foreground">Halal Certified</div>
                </div>
              </div>
            </Card>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">🍕</span>
                </div>
                <span className="text-foreground">Authentic Italian Recipes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-wine rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🥙</span>
                </div>
                <span className="text-foreground">Fresh Halal Kebabs</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">🚚</span>
                </div>
                <span className="text-foreground">Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-wine rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <span className="text-foreground">Premium Quality</span>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-elegant">
              <img 
                src={foodCollage} 
                alt="Authentic Italian pizza and kebabs"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-gold text-black px-4 py-2 rounded-full font-semibold shadow-gold">
                Made Fresh Daily
              </div>
            </div>
            
            {/* Decorative frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-gold/30 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;