import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ChefSection = () => {
  const [certifications, setCertifications] = useState<any[]>([
    {
      id: 1,
      title: "Master of Italian Cuisine",
      description: "Awarded by Accademia Italiana della Cucina in 2021",
      image: "/cert1.png",
    },
    {
      id: 2,
      title: "Michelin Recognition",
      description: "Featured in Michelin Guide 2022",
      image: "/cert2.png",
    },
    {
      id: 3,
      title: "Culinary Innovation Award",
      description: "Recognized for modern Italian fusion dishes",
      image: "/cert3.png",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide
  useEffect(() => {
    if (certifications.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === certifications.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [certifications]);

  const goToNext = () =>
    setCurrentIndex(
      currentIndex === certifications.length - 1 ? 0 : currentIndex + 1
    );
  const goToPrevious = () =>
    setCurrentIndex(
      currentIndex === 0 ? certifications.length - 1 : currentIndex - 1
    );

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-amber-900 to-background relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Certification Slider */}
        <div className="relative h-96 overflow-hidden rounded-2xl">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Card className="h-full flex flex-col justify-center items-center text-center shadow-elegant rounded-3xl">
                <div className="h-48 w-full overflow-hidden rounded-t-3xl">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gold mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Slider controls */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-3 rounded-full hover:bg-black/70"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-gold p-3 rounded-full hover:bg-black/70"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        {/* Right: Chef Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="/chef.png"
            alt="Head Chef"
            className="w-56 h-56 rounded-full object-cover border-4 border-gold shadow-lg mb-6"
          />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-4">
            Il Nostro Chef
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Chef Marco Rossi, con oltre 20 anni di esperienza, porta la vera
            tradizione italiana direttamente a tavola con un tocco moderno.
          </p>
          <Button variant="premium" size="lg">
            Conosci il Nostro Chef
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChefSection;
