import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Pause, Eye, Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { isMobile } from 'react-device-detect';
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface MenuImage {
  _id: string;
  imageUrl: string;
  category: string;
  uploadedAt: string;
}

const PhysicalMenuCarousel = () => {
  const [images, setImages] = useState<MenuImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [direction, setDirection] = useState(0); // 0: no direction, 1: next, -1: prev
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Refs for DOM elements and values that don't trigger re-renders
  const imageRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Swipe detection variables
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = useRef(50);

  // Memoized data calculations
  const categories = useRef<string[]>([]);
  const categoryImagesMap = useRef<Map<string, MenuImage[]>>(new Map());
  
  // Update derived data when images change
  useEffect(() => {
    if (images.length === 0) return;
    
    // Extract unique categories
    categories.current = Array.from(new Set(images.map(img => img.category)));
    
    // Create category to images mapping
    categoryImagesMap.current = images.reduce((map, image) => {
      if (!map.has(image.category)) {
        map.set(image.category, []);
      }
      map.get(image.category)!.push(image);
      return map;
    }, new Map<string, MenuImage[]>());
  }, [images]);

  // Fetch images with useCallback to prevent recreation on every render
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/images`);
      setImages(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch menu images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Manage auto-play with cleanup
  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isAutoPlaying, images.length, currentIndex]);

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          imageRef.current && !imageRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation handlers with useCallback
  const handleNext = useCallback(() => {
    if (isTransitioning || images.length === 0) return;
    setDirection(1);
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, images.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || images.length === 0) return;
    setDirection(-1);
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, images.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentIndex]);

  // Swipe handlers with useCallback
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance.current;
    const isRightSwipe = distance < -minSwipeDistance.current;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [handleNext, handlePrev]);
  
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

  // Preload next and previous images for smoother transitions
  useEffect(() => {
    if (images.length <= 1) return;
    
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    
    preloadImage(images[nextIndex].imageUrl);
    preloadImage(images[prevIndex].imageUrl);
  }, [currentIndex, images]);

  // Animation variants
  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    })
  };

  const thumbnailVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Loading state
  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div 
          className="relative mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-yellow-600 rounded-full mx-auto"></div>
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-bold text-yellow-800 mb-2 font-serif"
        >
          Loading Our Premium Menu
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-yellow-700"
        >
          Preparing an exquisite dining experience...
        </motion.p>
      </div>
    </motion.div>
  );

  // Error state
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center px-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-center max-w-md bg-yellow-50 rounded-2xl shadow-xl p-6 md:p-8 border border-yellow-200"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 10 }}
          className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-3xl">⚠️</span>
        </motion.div>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-800 mb-2 font-serif">Something went wrong</h2>
        <p className="text-yellow-700 mb-4">{error}</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => window.location.reload()} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-xl shadow-lg">
            🔄 Try Again
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  // Empty state
  if (!images.length) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center px-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-center max-w-md bg-yellow-50 rounded-2xl shadow-xl p-6 md:p-8 border border-yellow-200"
      >
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 10 }}
          className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-3xl">📋</span>
        </motion.div>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-800 mb-2 font-serif">Menu Coming Soon</h2>
        <p className="text-yellow-700 mb-4">We're crafting an exceptional culinary experience. Check back soon!</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => navigate('/menu')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-xl shadow-lg">
            View Online Menu
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const currentImage = images[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 pb-12"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-yellow-500/90 backdrop-blur-sm border-b border-yellow-600 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="text-yellow-900 hover:bg-yellow-400 hover:text-yellow-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
          </motion.div>
          
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-serif font-bold text-yellow-900"
          >
            Our <span className="text-yellow-800">Menu</span>
          </motion.h1>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              variant="ghost"
              size="icon"
              className="text-yellow-900 hover:bg-yellow-400 hover:text-yellow-900"
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide"
        >
          <div className="flex space-x-2">
            {categories.current.map((category) => {
              const categoryImages = categoryImagesMap.current.get(category) || [];
              const firstImageIndex = images.findIndex(img => img.category === category);
              
              return (
                <motion.button
                  key={category}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToSlide(firstImageIndex)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${currentImage.category === category ? 'bg-yellow-600 text-yellow-50' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                >
                  {category}
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 bg-yellow-500/20 px-2 py-1 rounded-full text-xs"
                  >
                    {categoryImages.length}
                  </motion.span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Carousel */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative bg-yellow-50 rounded-2xl overflow-hidden shadow-2xl border border-yellow-200 mb-6"
        >
          <div 
            className="relative h-[85vh] md:aspect-[16/10] md:h-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={imageRef}
            onTouchStart={() => setShowPopup(true)}
            onTouchEnd={() => setTimeout(() => setShowPopup(false), 2000)}
          >
            <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.img
                key={currentIndex}
                src={currentImage.imageUrl}
                alt={`Menu - ${currentImage.category}`}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full object-contain absolute inset-0"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%23fefce8'%3E%3Crect width='800' height='500' fill='%23fefce8'/%3E%3Cpath d='M400,250 L450,200 M400,250 L450,300 M400,250 L350,200 M400,250 L350,300' stroke='%23ca8a04' stroke-width='2'/%3E%3Ccircle cx='400' cy='250' r='50' stroke='%23ca8a04' stroke-width='2' fill='none'/%3E%3C/svg%3E";
                }}
              />
            </AnimatePresence>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-transparent"></div>
            
            {/* View Online Menu Button - Always visible on mobile, popup on desktop */}
            <div 
              className="absolute top-4 right-4 z-10"
              onMouseEnter={() => setShowPopup(true)}
              onMouseLeave={() => setShowPopup(false)}
            >
              {/* Mobile always visible button */}
              <div className="md:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/menu')}
                  className="bg-yellow-600/90 text-yellow-50 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-yellow-500 flex items-center gap-2 text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  <span>Online Menu</span>
                </motion.button>
              </div>
              
              {/* Desktop popup behavior */}
              <div className="hidden md:block">
                <AnimatePresence>
                  {showPopup && (
                    <motion.div 
                      ref={popupRef}
                      variants={popupVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="bg-yellow-600/90 text-yellow-50 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-yellow-500"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/menu')}
                        className="flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-md hover:bg-yellow-500/50 transition-colors"
                      >
                        <ExternalLink size={16} />
                        View Online Menu
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Category label */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 left-4 bg-yellow-600/90 text-yellow-50 px-3 py-1 rounded-full text-sm font-medium"
            >
              {currentImage.category}
            </motion.div>
            
            {/* Navigation Arrows */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(202, 138, 4, 0.7)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-yellow-600/50 text-yellow-50 p-3 rounded-full transition-all disabled:opacity-50 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(202, 138, 4, 0.7)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-yellow-600/50 text-yellow-50 p-3 rounded-full transition-all disabled:opacity-50 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
            
            {/* Image counter */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-4 right-4 bg-yellow-600/70 text-yellow-50 px-3 py-1 rounded-full text-sm"
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
          </div>
        </motion.div>

        {/* Thumbnail Carousel */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-yellow-800 font-medium mb-3">Browse Menu Pages</h3>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-yellow-100">
            {images.map((img, i) => (
              <motion.button 
                key={img._id}
                variants={thumbnailVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToSlide(i)}
                className={`flex-shrink-0 relative group ${i === currentIndex ? 'ring-2 ring-yellow-600' : 'opacity-80 hover:opacity-100'}`}
                aria-label={`View page ${i + 1}`}
                aria-current={i === currentIndex ? 'true' : 'false'}
              >
                <img 
                  src={img.imageUrl} 
                  alt={`Thumb ${i+1}`} 
                  className="w-20 h-16 object-cover rounded-lg" 
                  loading="lazy"
                />
                {i === currentIndex && (
                  <motion.div 
                    layoutId="activeThumbnail"
                    className="absolute inset-0 bg-yellow-500/20 rounded-lg"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-center border border-yellow-600"
        >
          <h2 className="text-2xl font-serif font-bold text-yellow-900 mb-2">Experience Our Cuisine</h2>
          <p className="text-yellow-800 mb-4">Visit us to enjoy these exquisite dishes prepared by our master chefs</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleOrderOnline} className="bg-yellow-700 hover:bg-yellow-800 text-yellow-50 font-medium">
                Make Reservation
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="border-yellow-600 text-yellow-800 hover:bg-yellow-500/30"
                onClick={() => navigate('/menu')}
              >
                View Online Menu
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PhysicalMenuCarousel;