import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Pause, Eye, Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

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
  const navigate = useNavigate();
  
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
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, images.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, images.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
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

  // Loading state
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-yellow-800 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-100 mb-2 font-serif">Loading Our Premium Menu</h2>
        <p className="text-yellow-200">Preparing an exquisite dining experience...</p>
      </div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-yellow-700/50">
        <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-100 mb-2 font-serif">Something went wrong</h2>
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-2 rounded-xl shadow-lg border border-yellow-500/30">
          🔄 Try Again
        </Button>
      </div>
    </div>
  );

  // Empty state
  if (!images.length) return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-yellow-700/50">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-100 mb-2 font-serif">Menu Coming Soon</h2>
        <p className="text-yellow-200 mb-4">We're crafting an exceptional culinary experience. Check back soon!</p>
        <Button onClick={() => navigate('/menu')} className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-2 rounded-xl shadow-lg border border-yellow-500/30">
          View Online Menu
        </Button>
      </div>
    </div>
  );

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 pb-12">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-yellow-700/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="text-yellow-100 hover:bg-yellow-900/20 hover:text-yellow-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-yellow-100">
            Our <span className="text-yellow-500">Menu</span>
          </h1>
          
          <Button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            variant="ghost"
            size="icon"
            className="text-yellow-100 hover:bg-yellow-900/20 hover:text-yellow-300"
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <div className="flex space-x-2">
            {categories.current.map((category) => {
              const categoryImages = categoryImagesMap.current.get(category) || [];
              const firstImageIndex = images.findIndex(img => img.category === category);
              
              return (
                <button
                  key={category}
                  onClick={() => goToSlide(firstImageIndex)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${currentImage.category === category ? 'bg-yellow-700 text-yellow-100' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {category}
                  <span className="ml-2 bg-black/20 px-2 py-1 rounded-full text-xs">
                    {categoryImages.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Carousel */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-yellow-700/30 mb-6">
          <div 
            className="relative h-[85vh] md:aspect-[16/10] md:h-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={imageRef}
            onTouchStart={() => setShowPopup(true)}
            onTouchEnd={() => setTimeout(() => setShowPopup(false), 2000)}
          >
            <img
              src={currentImage.imageUrl}
              alt={`Menu - ${currentImage.category}`}
              className={`w-full h-full object-contain transition-all duration-500 ${isTransitioning ? 'scale-105 opacity-70' : 'scale-100 opacity-100'}`}
              loading="eager"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%231a1a1a'%3E%3Crect width='800' height='500' fill='%231a1a1a'/%3E%3Cpath d='M400,250 L450,200 M400,250 L450,300 M400,250 L350,200 M400,250 L350,300' stroke='%23555' stroke-width='2'/%3E%3Ccircle cx='400' cy='250' r='50' stroke='%23555' stroke-width='2' fill='none'/%3E%3C/svg%3E";
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {/* View Online Menu Button - Always visible on mobile, popup on desktop */}
            <div 
              className="absolute top-4 right-4 z-10"
              onMouseEnter={() => setShowPopup(true)}
              onMouseLeave={() => setShowPopup(false)}
            >
              {/* Mobile always visible button */}
              <div className="md:hidden">
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-yellow-700/90 text-yellow-100 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-yellow-500/30 flex items-center gap-2 text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  <span>Online Menu</span>
                </button>
              </div>
              
              {/* Desktop popup behavior */}
              <div className="hidden md:block">
                {showPopup && (
                  <div 
                    ref={popupRef}
                    className="bg-yellow-700/90 text-yellow-100 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-yellow-500/30"
                  >
                    <button
                      onClick={() => navigate('/menu')}
                      className="flex items-center gap-2 text-sm font-medium px-2 py-1 rounded-md hover:bg-yellow-600/50 transition-colors"
                    >
                      <ExternalLink size={16} />
                      View Online Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Category label */}
            <div className="absolute top-4 left-4 bg-yellow-700/90 text-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
              {currentImage.category}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-yellow-100 p-3 rounded-full transition-all disabled:opacity-50 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-yellow-100 p-3 rounded-full transition-all disabled:opacity-50 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-yellow-100 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel */}
        <div className="mb-8">
          <h3 className="text-yellow-100 font-medium mb-3">Browse Menu Pages</h3>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-yellow-700 scrollbar-track-gray-800">
            {images.map((img, i) => (
              <button 
                key={img._id} 
                onClick={() => goToSlide(i)}
                className={`flex-shrink-0 relative group ${i === currentIndex ? 'ring-2 ring-yellow-500' : 'opacity-80 hover:opacity-100'}`}
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
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 rounded-xl p-6 text-center border border-yellow-700/30">
          <h2 className="text-2xl font-serif font-bold text-yellow-100 mb-2">Experience Our Cuisine</h2>
          <p className="text-yellow-200 mb-4">Visit us to enjoy these exquisite dishes prepared by our master chefs</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-yellow-700 hover:bg-yellow-600 text-yellow-100 font-medium">
              Make Reservation
            </Button>
            <Button 
              variant="outline" 
              className="border-yellow-700 text-yellow-200 hover:bg-yellow-900/30"
              onClick={() => navigate('/menu')}
            >
              View Online Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalMenuCarousel;