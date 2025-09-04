// src/components/Menu.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Utensils, Pizza, ChevronLeft, ChevronRight, ShoppingCart, X } from 'lucide-react';
import { GiCupcake, GiFullPizza, GiNoodles, GiSandwich } from "react-icons/gi";
import { TbPizzaOff } from "react-icons/tb";
import { MdKebabDining } from "react-icons/md";
import { GiHamburger } from "react-icons/gi";
import { RiDrinksLine } from "react-icons/ri";
import { isMobile as isMobileDevice } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import {
  addToCart,
  decreaseFromCart,
  getItemQty,
  CartItem,
  MenuItem,
  getCartItemCount,
  getEnrichedCartItems,
  calculateCartTotal,
  removeFromCart
} from "@/utils/cart";

const CartControls = ({ itemId }: { itemId: string }) => {
  const [qty, setQty] = useState<number>(getItemQty(itemId));

  useEffect(() => {
    // Sync with localStorage changes
    const syncCart = () => setQty(getItemQty(itemId));
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, [itemId]);

  const handleAdd = () => {
    addToCart(itemId);
    setQty(getItemQty(itemId));
  };

  const handleDecrease = () => {
    decreaseFromCart(itemId);
    setQty(getItemQty(itemId));
  };

  if (qty === 0) {
    return (
      <Button
        onClick={handleAdd}
        className="bg-yellow-500 text-black hover:bg-yellow-600 hover:text-black"
      >
        Add to Cart
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleDecrease}
        className="bg-yellow-700 text-black hover:bg-yellow-800"
      >
        -
      </Button>
      <span className="font-bold">{qty}</span>
      <Button
        onClick={handleAdd}
        className="bg-yellow-500 text-black hover:bg-yellow-600"
      >
        +
      </Button>
    </div>
  );
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [menuItems, setMenuItems] = useState<{ [key: string]: MenuItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

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
      try {
        const parsed = JSON.parse(storedOffer);
        const now = new Date();
        if (parsed.expiryDate && new Date(parsed.expiryDate) > now) {
          setDiscount(parsed.discount);
        }
      } catch (e) {
        console.error("Error parsing stored offer:", e);
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
        console.error('Failed to fetch menu items:', err);
        setError('Failed to fetch menu items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // Merge all items for "All" tab
  const allItems = Object.values(menuItems).flat();

  // Function to update cart data
  const updateCartData = useCallback(() => {
    const items = getEnrichedCartItems(allItems);
    setCartItems(items);
    setCartTotal(calculateCartTotal(allItems));
    setCartItemCount(getCartItemCount());
  }, [menuItems, allItems]);

  // Listen for cart updates
  useEffect(() => {
    updateCartData();

    const handleCartUpdate = () => {
      updateCartData();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [updateCartData]);

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
    if (isMobileDevice) {
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

  // Function to handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // For now, we'll just show an alert with the order summary
    // In a real implementation, this would redirect to a checkout page
    const orderSummary = cartItems.map(item =>
      `${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    alert(`Order Summary:\n${orderSummary}\n\nTotal: €${cartTotal.toFixed(2)}\n\nPlease call +39 0382 458734 to complete your order.`);
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
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-yellow-700">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-yellow-600 hover:bg-yellow-700">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Check if we're on mobile
  const isMobileView = window.innerWidth < 768;

  // Get current category items
  const currentItems = activeTab === "all" ? allItems : menuItems[activeTab] || [];

  return (
    <div className="min-h-screen bg-yellow-50 py-4 md:py-8 px-3 sm:px-4 relative overflow-hidden pb-20">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-yellow-200 rounded-full -translate-y-12 md:-translate-y-16 translate-x-12 md:translate-x-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-yellow-300 rounded-full -translate-x-16 md:-translate-x-20 translate-y-16 md:translate-y-20 opacity-30"></div>

      {/* Cart Icon */}
      <div className="fixed top-4 right-4 z-30">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl p-3 h-18 w-18 shadow-lg overflow-visible"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center shadow-md">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl text-black font-bold">Your Cart ({cartItemCount})</h2>
              <Button
                onClick={() => setIsCartOpen(false)}
                variant="ghost"
                size="icon"
                className="rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-black">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium text-black">{item.name}</h3>
                          <p className="text-sm text-black">
                            €{Number(item.price).toFixed(2)} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-black">€{(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg text-black font-bold">
                  <span>Total:</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-red-500 hover:bg-yellow-700 text-white py-3"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center mb-6 md:mb-8 gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white self-start sm:self-auto"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-900 font-serif">
              Our Menu
            </h1>
            <p className="text-yellow-700 mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl mx-auto">
              Discover our authentic Italian flavors and specialties
            </p>
          </div>
          <div className="hidden sm:block w-20"></div>
        </div>

        {/* Category Tabs - Desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(tabLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center px-4 py-2 rounded-full 
                text-sm font-medium transition-colors
                ${activeTab === key
                  ? 'bg-yellow-600 text-white'
                  : 'text-yellow-700 bg-yellow-200 hover:bg-yellow-300'}`}
            >
              <span className="mr-2">{tabIcons[key as keyof typeof tabIcons]}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="mb-16">
          {isMobileView ? (
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
                      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group h-full flex flex-col mx-auto max-w-md">
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
                        <CardContent className="p-6">
                          <h3 className="font-serif font-bold text-xl text-red-900 mb-3 text-center">
                            {item.name}
                          </h3>
                          <p className="text-red-400 text-sm leading-relaxed text-center">
                            {item.description}
                          </p>

                          {/* Price Display */}
                          <div className="mt-4 text-center">
                            {discount > 0 ? (
                              <div className="flex justify-center items-center gap-2">
                                <span className="text-lg text-red-500 font-bold">
                                  €{(Number(originalPrice) - (Number(originalPrice) * discount) / 100).toFixed(2)}
                                </span>
                                <span className="text-sm text-red-400 line-through">
                                  €{Number(originalPrice).toFixed(2)}
                                </span>
                                <span className="text-xs bg-red-500 text-red-400 px-2 py-1 rounded-xl">
                                  -{discount}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-red-800">
                                €{Number(originalPrice).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Cart Controls */}
                          <div className="mt-4 flex justify-center">
                            <CartControls itemId={item._id || item.id} />
                          </div>
                        </CardContent>

                        {/* Footer */}
                        <CardFooter className="p-4 pt-0">
                          {/* Price display can go here if needed */}
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
                        className={`h-2 w-2 rounded-xl transition-all duration-300 ${currentSlide === index
                          ? 'bg-yellow-600 w-6'
                          : 'bg-yellow-300 opacity-60'
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
                    className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group h-full flex flex-col"
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
                    <CardContent className="p-6">
                      <h3 className="font-serif font-bold text-xl text-black group-hover:text-yellow-700 transition-colors mb-3 text-center">
                        {item.name}
                      </h3>
                      <p className="text-black text-sm leading-relaxed group-hover:text-foreground/80 transition-colors text-center">
                        {item.description}
                      </p>

                      {/* Price Display */}
                      <div className="mt-4 text-center">
                        {discount > 0 ? (
                          <div className="flex justify-center items-center gap-2">
                            <span className="text-lg font-bold text-yellow-700">
                              €{(Number(originalPrice) - (Number(originalPrice) * discount) / 100).toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              €{Number(originalPrice).toFixed(2)}
                            </span>
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-xl">
                              -{discount}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-yellow-700">
                            €{Number(originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="p-4 pt-0 flex justify-center">
                      <CartControls itemId={item._id || item.id} />
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-yellow-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-center text-white mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Ready to order?</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base max-w-2xl mx-auto">
            Experience the authentic taste of Italy delivered right to your door
          </p>
          <Button onClick={handleOrderOnline} size="lg" className="bg-white text-yellow-700 hover:bg-yellow-100 text-sm md:text-base">
            Place Your Order Now
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Tabs - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-800 border-t border-yellow-700 shadow-lg z-20 md:hidden">
        <div className="overflow-x-auto">
          <div className="flex px-2 py-2 min-w-max">
            {Object.entries(tabLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentSlide(0);
                }}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl 
                  text-xs font-medium mx-1 min-w-[60px] transition-colors
                  ${activeTab === key
                    ? 'bg-yellow-600 text-white'
                    : 'text-yellow-200 bg-yellow-700 hover:bg-yellow-600'}`}
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
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Menu;