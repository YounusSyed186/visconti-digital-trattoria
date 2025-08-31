import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import heroImage from "@/assets/Bg1.png";

const HeroSection = () => {
  const router = useRouter();
  
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Animated glow effects */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-wine/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gold mb-4 animate-glow">
            Visconti
          </h1>
          <p className="text-2xl md:text-3xl font-light text-warm-white tracking-wider">
            Pizzeria Kebab
          </p>
        </div>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-warm-white/90 mb-12 font-light leading-relaxed">
          Authentic Italian Pizza & Halal Kebabs in Pavia
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-gold hover:bg-gold-dark text-black font-semibold px-8 py-4 text-lg shadow-gold hover:shadow-warm transition-all duration-300 transform hover:scale-105"
          >
            🛵 Order Online
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push('/menu')}
            className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
          >
            📋 View Full Menu
          </Button>
        </div>
        
        {/* Delivery platforms */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-warm-white/80">
          <span className="text-sm font-medium">Order via:</span>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
              JustEat
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
              Deliveroo
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;