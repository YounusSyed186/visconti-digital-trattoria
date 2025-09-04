import { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
        console.log('API response:', response.data);
        if (response.data && response.data.groupedItems) {
          // Flatten all menu items from all categories into a single array
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
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length === 0) return;

    // Set up auto-slide
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === menuItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change card every 4 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [menuItems]);

  const goToNext = () => {
    setCurrentIndex(currentIndex === menuItems.length - 1 ? 0 : currentIndex + 1);
    resetInterval();
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1);
    resetInterval();
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === menuItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
  };

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
    <div className="text-center py-12 text-red-500">
      <p>Error: {error}</p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-4 bg-yellow text-black hover:bg-black hover:text-gold"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <section id="menu" className="py-12 md:py-20 px-4 bg-yellow-100 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-4">
            Il Nostro Menu
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Scopri i nostri piatti autentici, preparati con ingredienti freschi e passione italiana
          </p>
        </div>

        {/* Menu Items with Sliding Animation */}
        <div className="relative h-96 md:h-[500px] w-full overflow-hidden rounded-2xl">
          <div className="relative h-full w-full">
            {menuItems.map((item, index) => (
              <div
                key={item._id || item.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <div className="flex justify-center items-center h-full px-4">
                  <Card className="glass-card hover-lift group border-0 shadow-elegant overflow-hidden rounded-3xl w-full max-w-md">
                    <div className="relative h-64 md:h-72 overflow-hidden">
                      <img
                        src={item.image || item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-300"></div>
                      <div className="absolute top-4 right-4 bg-gradient-gold text-black font-bold py-3 px-4 rounded-xl text-lg shadow-gold hover-glow">
                        {item.price} €
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-gold transition-colors mb-3 text-center">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors text-center">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Slider controls */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-3 rounded-full hover:bg-black/70 transition-colors z-20"
            aria-label="Previous dish"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-3 rounded-full hover:bg-black/70 transition-colors z-20"
            aria-label="Next dish"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex items-center justify-center gap-2">
              {menuItems.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={`h-3 rounded-full transition-all duration-300 ${slideIndex === currentIndex ? 'w-8 bg-yellow' : 'w-3 bg-gray-300'
                    }`}
                  aria-label={`Go to dish ${slideIndex + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Show Full Menu Button */}
        <div className="text-center mt-16">
          <Button
            onClick={handleShowFullMenu}
            variant="premium"
            size="xl"
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
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