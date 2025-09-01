import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
        
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
    
    // Set up auto-scroll
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    let scrollInterval: NodeJS.Timeout;
    let scrollDirection = 1; // 1 for right, -1 for left
    let scrollSpeed = 1; // Pixels per interval
    
    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          // Check if we've reached the end or beginning
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.offsetWidth - 5) {
            scrollDirection = -1;
          } else if (scrollContainer.scrollLeft <= 5) {
            scrollDirection = 1;
          }
          
          scrollContainer.scrollBy({
            left: scrollDirection * scrollSpeed,
            behavior: 'auto'
          });
        }
      }, 30);
    };
    
    startScrolling();
    
    // Pause on hover
    const pauseScroll = () => clearInterval(scrollInterval);
    const resumeScroll = () => startScrolling();
    
    scrollContainer.addEventListener('mouseenter', pauseScroll);
    scrollContainer.addEventListener('mouseleave', resumeScroll);
    
    return () => {
      clearInterval(scrollInterval);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', pauseScroll);
        scrollContainer.removeEventListener('mouseleave', resumeScroll);
      }
    };
  }, [menuItems]);

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
        className="mt-4 bg-gold text-black hover:bg-black hover:text-gold"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <section id="menu" className="py-12 md:py-20 px-4 bg-gradient-to-b from-background to-amber-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gold mb-4">
            Il Nostro Menu
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Scopri i nostri piatti autentici, preparati con ingredienti freschi e passione italiana
          </p>
        </div>

        {/* Menu Items with Auto Scrolling */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-8 px-4">
              {menuItems.map((item) => (
                <div key={item._id || item.id} className="snap-start flex-shrink-0 w-80">
                  <Card className="text-3xl font-bold text-stone-800 border-b-2 border-amber-600 pb-1 hover:shadow-lg transition-shadow duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image || item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-gold text-black font-bold py-2 px-3 rounded-md text-lg shadow-md">
                        {item.price} €
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-gold transition-colors mb-3">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Show Full Menu Button */}
        <div className="text-center mt-12">
          <Button
            onClick={handleShowFullMenu}
            className="bg-gradient-to-r from-gold to-amber-600 text-white hover:from-black hover:to-gold font-medium py-4 px-10 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
          >
            Vedi Menu Completo
          </Button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
};

export default MenuSection;