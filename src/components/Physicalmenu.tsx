import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { IconLeft } from "react-day-picker";

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

  const handleNext = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrev = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-center animate-on-scroll">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-wine/50 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="mt-6 text-xl text-gold font-medium">Loading menu images...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare your visual menu</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Oops! Something went wrong</h2>
        <p className="text-red-400 mb-6">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="gold"
          size="lg"
          className="group"
        >
          <span className="flex items-center gap-2">
            <span className="group-hover:animate-spin">🔄</span>
            Try Again
          </span>
        </Button>
      </div>
    </div>
  );

  if (!images.length) return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">No Menu Images Available</h2>
        <p className="text-muted-foreground mb-6">We're currently updating our visual menu. Please check back soon!</p>
        <Button 
          onClick={() => navigate('/menu')} 
          variant="gold"
          size="lg"
        >
          View Online Menu Instead
        </Button>
      </div>
    </div>
  );

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-64 h-64 bg-wine rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-amber-400 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="pt-8 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={() => navigate('/')} 
              variant="glass"
              size="lg"
              className="mb-8 group hover-lift"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-medium">Back to Home</span>
              </span>
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-gradient-gold mb-4 animate-on-scroll">
                Visual Menu Gallery
              </h1>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-on-scroll delay-100">
                Browse through our authentic Italian dishes and halal specialties
              </p>
            </div>
          </div>
        </div>

        {/* Main Carousel Section */}
        <div className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            {/* Image Display */}
            <div className="relative mb-12">
              <div className="relative aspect-[4/3] max-h-[600px] mx-auto overflow-hidden rounded-3xl shadow-elegant group">
                <img
                  src={currentImage.imageUrl}
                  alt={`Menu ${currentImage._id}`}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isTransitioning ? 'scale-105 blur-sm' : 'scale-100 blur-0'
                  } group-hover:scale-110`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 group-hover:from-black/20 transition-all duration-300"></div>
                
                {/* Image Counter */}
                <div className="absolute top-6 right-6 glass-card px-4 py-2 rounded-xl">
                  <span className="text-gold font-bold">
                    {currentIndex + 1} / {images.length}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-6 left-6 bg-gradient-gold text-black px-6 py-3 rounded-xl font-bold shadow-gold">
                  {currentImage.category}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  disabled={isTransitioning}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 glass-card rounded-full flex items-center justify-center hover-glow group/arrow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl text-gold group-hover/arrow:-translate-x-1 transition-transform">‹</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 glass-card rounded-full flex items-center justify-center hover-glow group/arrow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl text-gold group-hover/arrow:translate-x-1 transition-transform">›</span>
                </button>
              </div>

              {/* Image Meta Information */}
              <div className="mt-6 text-center">
                <div className="glass-card inline-block px-6 py-3 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-gold font-medium">Category:</span> {currentImage.category} • 
                    <span className="text-gold font-medium ml-2">Uploaded:</span> {new Date(currentImage.uploadedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
              <Button 
                onClick={handlePrev} 
                variant="glass"
                size="lg"
                disabled={isTransitioning}
                className="group disabled:opacity-50"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">‹</span>
                  Previous
                </span>
              </Button>

              <Button 
                onClick={() => navigate('/menu')} 
                variant="premium"
                size="xl"
                className="group"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl group-hover:animate-bounce">🍽️</span>
                  View Online Menu
                  <span className="text-xl group-hover:animate-bounce">📋</span>
                </span>
              </Button>

              <Button 
                onClick={handleNext} 
                variant="glass"
                size="lg"
                disabled={isTransitioning}
                className="group disabled:opacity-50"
              >
                <span className="flex items-center gap-3">
                  Next
                  <span className="text-xl group-hover:translate-x-1 transition-transform">›</span>
                </span>
              </Button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center">
              <div className="flex gap-2 p-2 glass-card rounded-2xl max-w-full overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image._id}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentIndex(index);
                        setTimeout(() => setIsTransitioning(false), 300);
                      }
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 ${
                      index === currentIndex 
                        ? 'ring-2 ring-gold shadow-gold scale-110' 
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23F4F4F5'/%3E%3C/svg%3E";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalMenuCarousel;
