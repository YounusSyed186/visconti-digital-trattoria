import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
      
      if (response.data?.groupedItems) {
        const allItems: any[] = [];
        Object.values(response.data.groupedItems).forEach((categoryItems: any) => {
          allItems.push(...categoryItems);
        });
        setMenuItems(allItems);
      } else {
        setError('API response is not in the expected format');
      }
    } catch (err) {
      setError('Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
    resetInterval();
  }, [menuItems.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
    resetInterval();
  }, [menuItems.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
    resetInterval();
  }, []);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(goToNext, 4000);
  }, [goToNext]);

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const minSwipeDistance = 50;
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  useEffect(() => {
    if (menuItems.length === 0) return;

    intervalRef.current = setInterval(goToNext, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [menuItems.length, goToNext]);

  const handleShowFullMenu = (): void => {
    navigate('/menu');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
        <p className="mt-2 text-gold">Loading menu...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-12 px-4 text-red-500">
      <p>Error: {error}</p>
      <Button
        onClick={() => fetchMenuItems()}
        className="mt-4 bg-yellow text-black hover:bg-black hover:text-gold"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <section id="menu" className="py-8 md:py-16 lg:py-20 px-4 bg-yellow-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-3 md:mb-4">
            Il Nostro Menu
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 md:mb-6">
            Scopri i nostri piatti autentici, preparati con ingredienti freschi e passione italiana
          </p>
        </div>

        {/* Menu Items with Sliding Animation */}
        <div 
          className="relative h-80 sm:h-96 md:h-[500px] w-full overflow-hidden rounded-xl md:rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-full w-full">
            {menuItems.map((item, index) => (
              <div
                key={item._id || item.id || index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                <div className="flex justify-center items-center h-full px-2 sm:px-4">
                  <Card className="glass-card hover-lift group border-0 shadow-elegant overflow-hidden rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md">
                    <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                      <img
                        src={item.image || item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-300"></div>
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-gradient-gold text-black font-bold py-2 px-3 md:py-3 md:px-4 rounded-lg md:rounded-xl text-base md:text-lg shadow-gold hover-glow">
                        {item.price} €
                      </div>
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="font-serif font-bold text-lg md:text-xl text-foreground group-hover:text-gold transition-colors mb-2 md:mb-3 text-center">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed group-hover:text-foreground/80 transition-colors text-center line-clamp-3">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Slider controls - Hidden on mobile when only one item */}
          {menuItems.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="hidden sm:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors z-20"
                aria-label="Previous dish"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="hidden sm:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors z-20"
                aria-label="Next dish"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots indicator - Only show on desktop */}
          {menuItems.length > 1 && (
            <div className="absolute bottom-3 md:bottom-4 left-0 right-0 hidden md:block">
              <div className="flex items-center justify-center gap-1 md:gap-2">
                {menuItems.map((_, slideIndex) => (
                  <button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`h-2 md:h-3 rounded-full transition-all duration-300 ${slideIndex === currentIndex ? 'w-6 md:w-8 bg-yellow' : 'w-2 md:w-3 bg-gray-300'
                      }`}
                    aria-label={`Go to dish ${slideIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Show Full Menu Button */}
        <div className="text-center mt-12 md:mt-16">
          <Button
            onClick={handleShowFullMenu}
            variant="premium"
            size="lg"
            className="group relative overflow-hidden text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
          >
            <span className="relative z-10 flex items-center gap-2 md:gap-3">
              <span className="text-xl group-hover:animate-bounce">📋</span>
              Vedi Menu Completo
              <span className="text-xl group-hover:animate-bounce">🍽️</span>
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;