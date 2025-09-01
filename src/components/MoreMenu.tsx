import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { MenuListingPageProps, MenuItem } from '@/types/menu';

const MenuListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, items, categoryLabel } = location.state as MenuListingPageProps;

  if (!category || !items) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚫</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">No Menu Data Available</h2>
          <p className="text-muted-foreground mb-6">Please go back to the menu and try again.</p>
          <Button 
            onClick={() => navigate('/')} 
            variant="gold"
            size="lg"
          >
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gold rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-60 h-60 bg-wine rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-12 animate-on-scroll">
            <div className="flex items-center gap-6">
              <Button 
                variant="glass" 
                size="lg"
                onClick={() => navigate(-1)}
                className="group hover-lift"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                  <span className="font-medium">Back</span>
                </span>
              </Button>
              
              <div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient-gold">
                  {categoryLabel || "Menu Items"}
                </h1>
                <div className="w-16 h-1 bg-gradient-gold mt-2 rounded-full"></div>
              </div>
            </div>

            <div className="hidden md:block glass-card px-4 py-2 rounded-xl">
              <span className="text-sm text-muted-foreground">
                {items.length} item{items.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid gap-8 md:gap-6">
            {items.map((item: MenuItem, index: number) => (
              <div 
                key={index}
                className="glass-card p-0 overflow-hidden hover-lift group animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-2/5 relative overflow-hidden">
                    <div className="aspect-[4/3] lg:aspect-square lg:h-64">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-300"></div>
                      
                      {/* Floating Price Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-gold text-black font-bold py-3 px-4 rounded-xl shadow-gold hover-glow">
                        <span className="text-lg">{item.price}</span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute bottom-4 left-4 glass-card px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="text-xs text-gold font-medium flex items-center gap-1">
                          <span>✨</span> Premium Quality
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-gold transition-colors mb-3 leading-tight">
                          {item.name}
                        </h3>
                        <div className="w-12 h-0.5 bg-gold/60 group-hover:bg-gold group-hover:w-20 transition-all duration-300"></div>
                      </div>
                      
                      <p className="text-muted-foreground text-base md:text-lg leading-relaxed group-hover:text-foreground/90 transition-colors">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50 group-hover:border-gold/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                        <span className="text-sm text-muted-foreground">Available now</span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold group-hover:scale-110 transition-transform">
                          {item.price}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Premium quality
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Information */}
          <div className="mt-20 pt-12 border-t border-border/30 text-center animate-on-scroll">
            <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-xl font-serif font-bold text-gold mb-4">Contact Information</h3>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <span>📧</span>
                  <a href="mailto:harmmafullahbangash25@gmail.com" className="hover:text-gold transition-colors">
                    harmmafullahbangash25@gmail.com
                  </a>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span className="font-medium">Q335-Q965617</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span>📍</span>
                  <span>123 Anywhere St., Any City</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuListingPage;