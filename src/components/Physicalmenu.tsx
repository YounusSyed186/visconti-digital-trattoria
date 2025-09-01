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

    const interval = setInterval(() => handleNext(), 4000);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-yellow-800 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-100 mb-2 font-serif">Loading Premium Menu</h2>
        <p className="text-yellow-200">Preparing our exquisite showcase...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-yellow-700">
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

  if (!images.length) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-yellow-700">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-100 mb-2 font-serif">No Menu Images</h2>
        <p className="text-yellow-200 mb-4">We're updating our premium menu. Check back soon!</p>
        <Button onClick={() => navigate('/menu')} className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-2 rounded-xl shadow-lg border border-yellow-500/30">
          View Online Menu
        </Button>
      </div>
    </div>
  );

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-black/70 backdrop-blur-sm border-b border-yellow-700/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-start">
            <Button onClick={() => navigate('/')} variant="outline" size="sm" className="border-yellow-700/50 text-yellow-200 hover:bg-yellow-900/20">
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
            <h1 className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Premium Menu Gallery
            </h1>
          </div>
          <Button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            variant="outline"
            size="sm"
            className={`border-yellow-700/50 text-yellow-200 ${isAutoPlaying ? 'bg-yellow-900/30 border-yellow-500 text-yellow-300' : 'hover:bg-yellow-900/20'}`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isAutoPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-3xl md:max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gray-900 border border-yellow-700/30">
          <img
            src={currentImage.imageUrl}
            alt={`Menu ${currentImage._id}`}
            className={`w-full object-cover transition-all duration-500 ${isTransitioning ? 'scale-105 blur-sm opacity-80' : 'scale-100 blur-0 opacity-100'} ${window.innerWidth < 768 ? 'h-[500px]' : 'aspect-[16/10]'}`}
            onError={(e) => e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%231a1a1a'%3E%3Crect width='800' height='500' fill='%231a1a1a'/%3E%3Cpath d='M400,250 L450,200 M400,250 L450,300 M400,250 L350,200 M400,250 L350,300' stroke='%23555' stroke-width='2'/%3E%3Ccircle cx='400' cy='250' r='50' stroke='%23555' stroke-width='2' fill='none'/%3E%3C/svg%3E"}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"></div>

          {/* Navigation Arrows */}
          <button onClick={handlePrev} disabled={isTransitioning} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/70 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
            <ArrowLeft className="w-4 md:w-6 h-4 md:h-6 text-yellow-400" />
          </button>
          <button onClick={handleNext} disabled={isTransitioning} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/70 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
            <ArrowRight className="w-4 md:w-6 h-4 md:h-6 text-yellow-400" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex overflow-x-auto gap-2 mt-4">
          {images.map((img, i) => (
            <button key={img._id} onClick={() => goToSlide(i)} className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border ${i === currentIndex ? 'ring-2 ring-yellow-500 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}>
              <img src={img.imageUrl} alt={`Thumb ${i+1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Featured Categories (Vertical on Mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Array.from(new Set(images.map(img => img.category))).slice(0, 4).map((cat, idx) => (
            <div key={cat} className="bg-black/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-yellow-700/30 hover:scale-105 transition-all cursor-pointer" onClick={() => goToSlide(images.findIndex(img => img.category === cat))}>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">{idx===0?'🍕':idx===1?'🥙':idx===2?'🍔':'🥤'}</span>
              </div>
              <h3 className="text-yellow-200 font-medium">{cat}</h3>
              <p className="text-xs text-yellow-300/70">{images.filter(img => img.category===cat).length} items</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysicalMenuCarousel;
