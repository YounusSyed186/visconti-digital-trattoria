import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 0: no direction, 1: forward, -1: backward
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
    setDirection(1);
    setCurrentIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
    resetInterval();
  }, [menuItems.length]);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
    resetInterval();
  }, [menuItems.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setDirection(slideIndex > currentIndex ? 1 : -1);
    setCurrentIndex(slideIndex);
    resetInterval();
  }, [currentIndex]);

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

  // Animation variants for the menu items
  const itemVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    })
  };

  // Animation for the dots
  const dotVariants = {
    inactive: {
      scale: 1,
      backgroundColor: "#D1D5DB", // gray-300
    },
    active: {
      scale: 1.2,
      backgroundColor: "#FDE68A", // yellow
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    }
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-64"
    >
      <div className="text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-gold"
        >
          Loading menu...
        </motion.p>
      </div>
    </motion.div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12 px-4 text-red-500"
    >
      <p>Error: {error}</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => fetchMenuItems()}
          className="mt-4 bg-yellow text-black hover:bg-black hover:text-gold"
        >
          Try Again
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.section 
      id="menu" 
      className="py-8 md:py-16 lg:py-20 px-4 bg-yellow-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-8 md:mb-12 lg:mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-3 md:mb-4">
            Il Nostro Menu
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 md:mb-6">
            Scopri i nostri piatti autentici, preparati con ingredienti freschi e passione italiana
          </p>
        </motion.div>

        {/* Menu Items with Framer Motion Animation */}
        <div 
          className="relative h-80 sm:h-96 md:h-[500px] w-full overflow-hidden rounded-xl md:rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={itemVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex justify-center items-center h-full px-2 sm:px-4"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="w-full max-w-sm md:max-w-md"
              >
                <Card className="glass-card hover-lift group border-0 shadow-elegant overflow-hidden rounded-2xl md:rounded-3xl w-full">
                  <motion.div 
                    className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={menuItems[currentIndex]?.image || menuItems[currentIndex]?.imageUrl || "/placeholder.png"}
                      alt={menuItems[currentIndex]?.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-300"></div>
                    <motion.div 
                      className="absolute top-3 right-3 md:top-4 md:right-4 bg-gradient-gold text-black font-bold py-2 px-3 md:py-3 md:px-4 rounded-lg md:rounded-xl text-base md:text-lg shadow-gold hover-glow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {menuItems[currentIndex]?.price} €
                    </motion.div>
                  </motion.div>
                  <CardContent className="p-4 md:p-6">
                    <h3 className="font-serif font-bold text-lg md:text-xl text-foreground group-hover:text-gold transition-colors mb-2 md:mb-3 text-center">
                      {menuItems[currentIndex]?.name}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed group-hover:text-foreground/80 transition-colors text-center line-clamp-3">
                      {menuItems[currentIndex]?.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controls - Hidden on mobile when only one item */}
          {menuItems.length > 1 && (
            <>
              <motion.button
                onClick={goToPrevious}
                className="hidden sm:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors z-20"
                aria-label="Previous dish"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                onClick={goToNext}
                className="hidden sm:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors z-20"
                aria-label="Next dish"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Dots indicator - Only show on desktop */}
          {menuItems.length > 1 && (
            <div className="absolute bottom-3 md:bottom-4 left-0 right-0 hidden md:block">
              <div className="flex items-center justify-center gap-1 md:gap-2">
                {menuItems.map((_, slideIndex) => (
                  <motion.button
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    variants={dotVariants}
                    initial="inactive"
                    animate={slideIndex === currentIndex ? "active" : "inactive"}
                    className="h-2 md:h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: slideIndex === currentIndex ? '2rem' : '0.75rem',
                    }}
                    aria-label={`Go to dish ${slideIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Show Full Menu Button */}
        <motion.div 
          className="text-center mt-12 md:mt-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleShowFullMenu}
              variant="premium"
              size="lg"
              className="group relative overflow-hidden text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
            >
              <span className="relative z-10 flex items-center gap-2 md:gap-3">
                <motion.span 
                  animate={{ rotate: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                  className="text-xl"
                >
                  📋
                </motion.span>
                Vedi Menu Completo
                <motion.span 
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                  className="text-xl"
                >
                  🍽️
                </motion.span>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MenuSection;