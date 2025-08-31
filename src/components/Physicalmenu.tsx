import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  

  if (loading) return <div>Loading images...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!images.length) return <div>No images available</div>;

  const currentImage = images[currentIndex];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
      <div className="relative h-96 overflow-hidden rounded-lg">
        <img
          src={currentImage.imageUrl}
          alt={`Menu ${currentImage._id}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Show Menu Button */}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrev} className="bg-gray-200 text-black hover:bg-gray-400">
          Prev
        </Button>
        <Button onClick={handleNext} className="bg-gray-200 text-black hover:bg-gray-400">
          Next
        </Button>
      </div>

      {/* Caption */}
      <div className="mt-2 text-center text-sm text-muted-foreground">
        Category: {currentImage.category} | Uploaded: {new Date(currentImage.uploadedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default PhysicalMenuCarousel;
