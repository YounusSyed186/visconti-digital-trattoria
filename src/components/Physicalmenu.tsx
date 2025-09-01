import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Pause, Eye, Calendar } from "lucide-react";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/images`);
        console.log("Fetched images:", response.data);
        setImages(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch menu images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, currentIndex]);

  const handleNext = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handlePrev = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-orange-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Loading Visual Menu</h2>
        <p className="text-gray-600">Preparing our delicious showcase...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Something went wrong</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span className="flex items-center gap-2">
            <span className="animate-spin">🔄</span>
            Try Again
          </span>
        </Button>
      </div>
    </div>
  );

  if (!images.length) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">No Menu Images</h2>
        <p className="text-gray-600 mb-6">We're updating our visual menu. Check back soon!</p>
        <Button 
          onClick={() => navigate('/menu')} 
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          View Online Menu
        </Button>
      </div>
    </div>
  );

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                size="lg"
                className="group border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Home</span>
              </Button>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                  Visual Menu Gallery
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mt-2 rounded-full"></div>
              </div>
            </div>

            {/* Auto-play Toggle */}
            <Button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              variant="outline"
              size="sm"
              className={`border-amber-200 transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-amber-100 border-amber-400 text-amber-700' 
                  : 'hover:bg-amber-50'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAutoPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Carousel */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Image Display */}
        <div className="relative mb-12">
          <div className="relative aspect-[16/10] max-h-[600px] mx-auto overflow-hidden rounded-3xl shadow-2xl bg-white">
            <img
              src={currentImage.imageUrl}
              alt={`Menu ${currentImage._id}`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isTransitioning ? 'scale-105 blur-sm opacity-80' : 'scale-100 blur-0 opacity-100'
              }`}
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%23f3f4f6'%3E%3Crect width='800' height='500' fill='%23f9fafb'/%3E%3Ccircle cx='400' cy='250' r='100' fill='%23e5e7eb'/%3E%3C/svg%3E";
              }}
            />
            
            {/* Image Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
            
            {/* Counter Badge */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
              <span className="text-amber-700 font-bold text-lg">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-6 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {currentImage.category}
              </span>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              disabled={isTransitioning}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ArrowLeft className="w-6 h-6 text-amber-700 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ArrowRight className="w-6 h-6 text-amber-700 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Bottom Info Panel */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Uploaded</p>
                      <p className="text-xs text-gray-500">
                        {new Date(currentImage.uploadedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <p className="text-xs text-amber-600 font-medium">{currentImage.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <Button 
            onClick={handlePrev} 
            variant="outline"
            size="lg"
            disabled={isTransitioning}
            className="group border-amber-200 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Previous Image
          </Button>

          <Button 
            onClick={() => navigate('/menu')} 
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">🍽️</span>
              Explore Full Menu
              <span className="text-xl">📋</span>
            </span>
          </Button>

          <Button 
            onClick={handleNext} 
            variant="outline"
            size="lg"
            disabled={isTransitioning}
            className="group border-amber-200 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50 transition-all duration-300"
          >
            Next Image
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200/50">
            <div className="flex gap-3 max-w-full overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image._id}
                  onClick={() => goToSlide(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 ${
                    index === currentIndex 
                      ? 'ring-4 ring-amber-400 shadow-lg scale-110' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80' fill='%23f3f4f6'%3E%3Crect width='80' height='80' fill='%23f9fafb'/%3E%3Ccircle cx='40' cy='40' r='20' fill='%23e5e7eb'/%3E%3C/svg%3E";
                    }}
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-amber-200/50">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 bg-gradient-to-r from-amber-500 to-orange-500' 
                        : 'w-2 bg-amber-200 hover:bg-amber-300 cursor-pointer'
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
              <div className="w-px h-4 bg-amber-200"></div>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentIndex + 1) / images.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from(new Set(images.map(img => img.category))).slice(0, 4).map((category, index) => (
            <div 
              key={category}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-amber-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => {
                const categoryIndex = images.findIndex(img => img.category === category);
                if (categoryIndex !== -1) goToSlide(categoryIndex);
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl">
                  {index === 0 ? '🍕' : index === 1 ? '🥙' : index === 2 ? '🍔' : '🥤'}
                </span>
              </div>
              <h3 className="font-medium text-gray-700 group-hover:text-amber-700 transition-colors">
                {category}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {images.filter(img => img.category === category).length} items
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysicalMenuCarousel;