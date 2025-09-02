import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Utensils, Pizza, ChevronLeft, ChevronRight } from 'lucide-react';
import { GiCupcake, GiFullPizza, GiNoodles, GiSandwich } from "react-icons/gi";
import { TbPizzaOff } from "react-icons/tb";
import { MdKebabDining } from "react-icons/md";
import { GiHamburger } from "react-icons/gi";
import { RiDrinksLine } from "react-icons/ri";
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';


const Menu = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [menuItems, setMenuItems] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Swipe detection variables
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = useRef(50); // Minimum distance for a swipe to be registered

  const tabLabels = {
    all: "All",
    "pizze-tradizionali": "Traditional",
    "pizze-speciali": "Specialty",
    calzoni: "Calzones",
    "kebab-panini": "Kebab",
    burgers: "Burgers",
    bibite: "Drinks",
    "paidina & panino": "Panini",
    "Indian cuisine": "Indian",
    dolco: "Desserts"
  };

  const tabIcons = {
    all: <Utensils className="w-4 h-4" />,
    "pizze-tradizionali": <Pizza className="w-4 h-4" />,
    "pizze-speciali": <TbPizzaOff className="w-4 h-4" />,
    calzoni: <GiFullPizza className="w-4 h-4" />,
    "kebab-panini": <MdKebabDining className="w-4 h-4" />,
    burgers: <GiHamburger className="w-4 h-4" />,
    bibite: <RiDrinksLine className="w-4 h-4" />,
    "paidina & panino": <GiSandwich className="w-4 h-4" />,
    "Indian cuisine": <GiNoodles className="w-4 h-4" />,
    dolco: <GiCupcake className="w-4 h-4" />
  };

  // ✅ Load discount from localStorage
  useEffect(() => {
    const storedOffer = localStorage.getItem("activeOffer");
    if (storedOffer) {
      const parsed = JSON.parse(storedOffer);
      const now = new Date();
      if (parsed.expiryDate && new Date(parsed.expiryDate) > now) {
        setDiscount(parsed.discount);
      }
    }
  }, []);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
        if (response.data?.groupedItems && typeof response.data.groupedItems === 'object') {
          setMenuItems(response.data.groupedItems);
        } else {
          setError('API response is not in the expected format');
        }
      } catch (err) {
        setError('Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // Reset slide when tab changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  // Scroll carousel to current slide
  const scrollToSlide = useCallback((slideIndex: number) => {
    if (carouselRef.current && window.innerWidth < 768) {
      const itemWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: slideIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToSlide(currentSlide);
  }, [currentSlide, scrollToSlide]);

  // Auto-slide carousel on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      // Clear any existing timer
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }

      // Start new timer
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          const items = activeTab === "all" 
            ? Object.values(menuItems).flat() 
            : menuItems[activeTab] || [];
          const nextSlide = (prev + 1) % Math.max(items.length, 1);
          return nextSlide;
        });
      }, 4000); // Change slide every 4 seconds

      // Cleanup on unmount or when dependencies change
      return () => {
        if (slideTimerRef.current) {
          clearInterval(slideTimerRef.current);
        }
      };
    }
  }, [activeTab, menuItems]);

  // Handle manual navigation
  const goToNextSlide = () => {
    const items = activeTab === "all" 
      ? Object.values(menuItems).flat() 
      : menuItems[activeTab] || [];
    setCurrentSlide(prev => (prev + 1) % Math.max(items.length, 1));
    
    // Reset timer on manual navigation
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % Math.max(items.length, 1));
      }, 4000);
    }
  };
   const handleOrderOnline = () => {
    if (isMobile) {
      // Open phone dialer with the restaurant's number
      window.location.href = 'tel:+390382458734';
    } else {
      // For desktop users, perhaps open a modal or redirect to online ordering
      // For now, let's just show an alert with the phone number
      alert(`${t("heroSection.callToOrder")}: +39 0382 458734`);
    }
  };

  const goToPrevSlide = () => {
    const items = activeTab === "all" 
      ? Object.values(menuItems).flat() 
      : menuItems[activeTab] || [];
    setCurrentSlide(prev => (prev - 1 + items.length) % Math.max(items.length, 1));
    
    // Reset timer on manual navigation
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % Math.max(items.length, 1));
      }, 4000);
    }
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance.current;
    const isRightSwipe = distance < -minSwipeDistance.current;
    
    if (isLeftSwipe) {
      goToNextSlide();
    } else if (isRightSwipe) {
      goToPrevSlide();
    }
    
    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-warm-700">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Merge all items for "All" tab
  const allItems = Object.values(menuItems).flat();

  // Check if we're on mobile
  const isMobile = window.innerWidth < 768;

  // Get current category items
  const currentItems = activeTab === "all" ? allItems : menuItems[activeTab] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-warm-100 py-4 md:py-8 px-3 sm:px-4 relative overflow-hidden pb-20">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-amber-200 rounded-full -translate-y-12 md:-translate-y-16 translate-x-12 md:translate-x-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-amber-300 rounded-full -translate-x-16 md:-translate-x-20 translate-y-16 md:translate-y-20 opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center mb-6 md:mb-8 gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center bg-amber-600 hover:bg-amber-700 text-white self-start sm:self-auto"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-warm-900 font-serif">
              Our Menu
            </h1>
            <p className="text-warm-700 mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl mx-auto">
              Discover our authentic Italian flavors and specialties
            </p>
          </div>
          <div className="hidden sm:block w-20"></div>
        </div>

        {/* Menu Items */}
        <div className="mb-16">
          {isMobile ? (
            // Mobile Carousel View
            <div className="relative">
              <div 
                ref={carouselRef}
                className="flex overflow-x-hidden snap-x snap-mandatory no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {currentItems.map((item, index) => {
                  const originalPrice = item.price;
                  const discountedPrice =
                    discount > 0 ? (originalPrice - (originalPrice * discount) / 100).toFixed(2) : null;

                  return (
                    <div 
                      key={index} 
                      className="w-full flex-shrink-0 snap-start px-2"
                    >
                      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-black group h-full flex flex-col mx-auto max-w-md">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.image || item.imageUrl || "/placeholder-food.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-food.jpg";
                            }}
                          />
                        </div>

                        {/* Details */}
                        <CardContent className="p-4 flex-grow">
                          <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors mb-2 line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-warm-300 text-sm leading-relaxed line-clamp-3">
                            {item.description}
                          </p>

                          {/* Price with discount */}
                          {discountedPrice ? (
                            <div className="mt-2">
                              <p className="text-xs text-red-400 line-through">€{originalPrice}</p>
                              <p className="font-semibold text-amber-500">€{discountedPrice}</p>
                            </div>
                          ) : (
                            <p className="mt-2 font-semibold text-amber-500">€{originalPrice}</p>
                          )}
                        </CardContent>

                        {/* Footer */}
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">
                            Add to Order
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  );
                })}
              </div>
              
              {/* Carousel Navigation */}
              {currentItems.length > 1 && (
                <>

                  
                  {/* Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {currentItems.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          currentSlide === index 
                            ? 'bg-amber-600 w-6' 
                            : 'bg-amber-300 opacity-60'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Desktop Grid View
            <div className="grid gap-4 md:gap-6 grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentItems.map((item, index) => {
                const originalPrice = item.price;
                const discountedPrice =
                  discount > 0 ? (originalPrice - (originalPrice * discount) / 100).toFixed(2) : null;

                return (
                  <Card
                    key={index}
                    className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-black group h-full flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-40 md:h-48 overflow-hidden">
                      <img
                        src={item.image || item.imageUrl || "/placeholder-food.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-food.jpg";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <CardContent className="p-4 flex-grow">
                      <h3 className="font-bold text-base text-warm-900 group-hover:text-amber-700 transition-colors mb-2 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-warm-700 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      {/* Price with discount */}
                      {discountedPrice ? (
                        <div className="mt-2">
                          <p className="text-xs text-red-500 line-through">€{originalPrice}</p>
                          <p className="font-semibold text-amber-600">€{discountedPrice}</p>
                        </div>
                      ) : (
                        <p className="mt-2 font-semibold text-amber-600">€{originalPrice}</p>
                      )}
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm">
                        Add to Order
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-amber-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-center text-white mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Ready to order?</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base max-w-2xl mx-auto">
            Experience the authentic taste of Italy delivered right to your door
          </p>
          <Button onClick={handleOrderOnline} size="lg" className="bg-white text-amber-700 hover:bg-warm-100 text-sm md:text-base">
            Place Your Order Now
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Tabs - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-amber-800 shadow-lg z-20 md:hidden">
        <div className="overflow-x-auto">
          <div className="flex px-2 py-2 min-w-max">
            {Object.entries(tabLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentSlide(0);
                }}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-full 
                  text-xs font-medium mx-1 min-w-[60px] transition-colors
                  ${activeTab === key 
                    ? 'bg-amber-600 text-white' 
                    : 'text-amber-200 bg-amber-900 hover:bg-amber-800'}`}
              >
                <span className="mb-1">{tabIcons[key as keyof typeof tabIcons]}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Menu;