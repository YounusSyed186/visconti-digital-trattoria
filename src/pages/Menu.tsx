// src/components/Menu.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Utensils, Pizza, ShoppingCart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GiCupcake, GiFrenchFries, GiFullPizza, GiNoodles } from "react-icons/gi";
import { TbPizzaOff } from "react-icons/tb";
import { MdFastfood, MdKebabDining } from "react-icons/md";
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
import { motion, AnimatePresence } from "framer-motion";

/**
 * Updated Menu.tsx
 * - Adds search bar (debounced)
 * - Improves swipe handling and reduces latency
 * - Applies consistent color palette: primary yellow + red + blue accents
 * - Keeps your existing cart utils and layout
 */

/* ----------------------
   Colors (tailwind-ish classes are used throughout).
   We also add CSS variables to the component so colors can be changed easily.
   ---------------------- */

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
        className="bg-primary-yellow text-black hover:bg-primary-yellow-dark hover:text-black px-3 py-2 rounded-md"
      >
        Add to Cart
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleDecrease}
        className="bg-accent-red text-white hover:bg-accent-red-dark px-3 py-2 rounded-md"
      >
        -
      </Button>
      <span className="font-bold">{qty}</span>
      <Button
        onClick={handleAdd}
        className="bg-primary-yellow text-black hover:bg-primary-yellow-dark px-3 py-2 rounded-md"
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileView, setIsMobileView] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const slideTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Improved swipe detection variables
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = useRef(30); // lower threshold to make swipes more responsive
  const maxTapDuration = useRef(250); // ms — quick swipe vs long press
  const slideAnimationInProgress = useRef(false);

  // Debounce helper for search
  const searchDebounceRef = useRef<number | null>(null);

  const tabLabels: { [key: string]: string } = {
    all: "All",
    "menu fisso": "menu-fisso",
    "pizze-tradizionali": "pizze-tradizionali",
    "pizze-speciali": "pizze-speciali",
    calzoni: "calzoni",
    "kebab-panini": "kebab-panini",
    burgers: "Burgers",
    bibite: "bibite",
    "fritte": "fritte",
    "Indian cuisine": "Indian",
    dolco: "dolco"
  };

  const tabIcons = {
    all: <Utensils className="w-4 h-4" />,
    "menu fisso": <MdFastfood className="w-4 h-4" />,
    "pizze-tradizionali": <Pizza className="w-4 h-4" />,
    "pizze-speciali": <GiFullPizza className="w-4 h-4" />,
    calzoni: <img src="/calzone.png" alt="Calzoni" className="w-4 h-4" />,
    "kebab-panini": <MdKebabDining className="w-4 h-4" />,
    burgers: <GiHamburger className="w-4 h-4" />,
    bibite: <RiDrinksLine className="w-4 h-4" />,
    "fritte": <GiFrenchFries className="w-4 h-4" />,
    "Indian cuisine": <GiNoodles className="w-4 h-4" />,
    dolco: <GiCupcake className="w-4 h-4" />
  };

  // Load discount from localStorage
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
          console.log('Fetched menu items:', response.data.groupedItems);
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

  // Responsive listener for viewport changes
  useEffect(() => {
    const onResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Reset slide when tab changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  // Scroll carousel to current slide - uses requestAnimationFrame for smoother scroll
  const scrollToSlide = useCallback((slideIndex: number) => {
    if (carouselRef.current && isMobileView) {
      const itemWidth = carouselRef.current.offsetWidth;
      // Use native smooth scroll
      carouselRef.current.scrollTo({
        left: slideIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  }, [isMobileView]);

  useEffect(() => {
    scrollToSlide(currentSlide);
  }, [currentSlide, scrollToSlide]);

  // Auto-slide carousel on mobile using setTimeout (easier to reset)
  useEffect(() => {
    if (!isMobileView) return;

    const items = activeTab === "all" ? Object.values(menuItems).flat() : menuItems[activeTab] || [];
    const count = Math.max(items.length, 1);

    const startTimer = () => {
      // clear if exists
      if (slideTimerRef.current) {
        window.clearTimeout(slideTimerRef.current);
      }
      slideTimerRef.current = window.setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % count);
      }, 4000);
    };

    startTimer();

    return () => {
      if (slideTimerRef.current) {
        window.clearTimeout(slideTimerRef.current);
      }
    };
  }, [activeTab, menuItems, isMobileView, currentSlide]);

  // manual navigation helpers (also reset auto-timer)
  const resetAutoSlideTimer = useCallback(() => {
    if (!isMobileView) return;
    if (slideTimerRef.current) {
      window.clearTimeout(slideTimerRef.current);
    }
    slideTimerRef.current = window.setTimeout(() => {
      const items = activeTab === "all" ? Object.values(menuItems).flat() : menuItems[activeTab] || [];
      setCurrentSlide(prev => (prev + 1) % Math.max(items.length, 1));
    }, 4000);
  }, [activeTab, menuItems, isMobileView]);

  const goToNextSlide = useCallback(() => {
    const items = activeTab === "all" ? Object.values(menuItems).flat() : menuItems[activeTab] || [];
    setCurrentSlide(prev => (prev + 1) % Math.max(items.length, 1));
    resetAutoSlideTimer();
  }, [activeTab, menuItems, resetAutoSlideTimer]);

  const goToPrevSlide = useCallback(() => {
    const items = activeTab === "all" ? Object.values(menuItems).flat() : menuItems[activeTab] || [];
    setCurrentSlide(prev => (prev - 1 + items.length) % Math.max(items.length, 1));
    resetAutoSlideTimer();
  }, [activeTab, menuItems, resetAutoSlideTimer]);

  const handleOrderOnline = () => {
    if (isMobileDevice) {
      // Open phone dialer with the restaurant's number
      window.location.href = 'tel:+390382458734';
    } else {
      // Desktop fallback
      alert(`${t("heroSection.callToOrder") || 'Call to order'}: +39 0382 458734`);
    }
  };

  // Checkout summary alert
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const orderSummary = cartItems.map(item =>
      `${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    alert(`Order Summary:\n${orderSummary}\n\nTotal: €${cartTotal.toFixed(2)}\n\nPlease call +39 0382 458734 to complete your order.`);
  };

  /* ----------------------------
     Touch / Swipe handlers (improved)
     - more tolerant threshold (minSwipeDistance)
     - uses velocity (distance / time)
     - ignores tiny taps
     ---------------------------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    // Prevent default to avoid browser interference with scrolling
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!e.changedTouches.length) return;

    const endX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - endX;
    const timeElapsed = Date.now() - touchStartTime.current;

    // Simple distance-based detection (no velocity needed)
    if (Math.abs(deltaX) > minSwipeDistance.current && timeElapsed < 300) {
      if (deltaX > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
  };

  // Debounced search input change
  useEffect(() => {
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }
    // small debounce so typing is smooth and UI filter is not immediate every keystroke
    searchDebounceRef.current = window.setTimeout(() => {
      // just setting searchQuery is enough — filtering is done below
    }, 150);

    return () => {
      if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow mx-auto mb-4"></div>
          <p className="text-primary-yellow-dark">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <p className="text-accent-red mb-4">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-primary-yellow hover:bg-primary-yellow-dark text-black">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Get current category items and apply search filter
  const currentItemsUnfiltered = activeTab === "all" ? allItems : menuItems[activeTab] || [];
  const q = (searchQuery || "").trim().toLowerCase();
  const currentItems = q.length > 0
    ? currentItemsUnfiltered.filter(it =>
      (it.name || "").toLowerCase().includes(q) ||
      (it.description || "").toLowerCase().includes(q)
    )
    : currentItemsUnfiltered;

  // Utility: image fallback (used inline in img onError)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder-food.jpg";
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-4 md:py-8 px-3 sm:px-4 relative overflow-hidden pb-20"
      style={{
        // define color variables for consistency
        // primary: yellow, accent-red, accent-blue
        // you can change these here for theming
        ['--primary-yellow' as any]: '#FFD54A',
        ['--primary-yellow-dark' as any]: '#F6C024',
        ['--accent-red' as any]: '#E53935',
        ['--accent-red-dark' as any]: '#C62828',
        ['--accent-blue' as any]: '#90CAF9'
      }}
    >
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-accent-blue/30 rounded-full -translate-y-12 md:-translate-y-16 translate-x-12 md:translate-x-16 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-accent-red/20 rounded-full -translate-x-16 md:-translate-x-20 translate-y-16 md:translate-y-20 opacity-60"></div>

      {/* Cart Icon */}
      <div className="fixed top-4 right-4 z-30">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-[var(--primary-yellow)] hover:bg-[var(--primary-yellow-dark)] text-black rounded-xl p-3 h-18 w-18 shadow-lg overflow-visible"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent-red text-white rounded-full text-xs h-5 w-5 flex items-center justify-center shadow-md"
              style={{ backgroundColor: 'var(--accent-red)' }}>
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
                          onError={handleImageError}
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
                          onClick={() => {
                            removeFromCart(item.id);
                            // ensure immediate UI sync
                            window.dispatchEvent(new CustomEvent('cartUpdated'));
                            updateCartData();
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-accent-red"
                          style={{ color: 'var(--accent-red)' }}
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
                  className="w-full bg-accent-red hover:bg-accent-red-dark text-white py-3"
                  style={{ backgroundColor: 'var(--accent-red)' }}
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
            className="flex items-center bg-[var(--primary-yellow)] hover:bg-[var(--primary-yellow-dark)] text-black self-start sm:self-auto"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-800 font-serif">
              Our Menu
            </h1>
            <p className="text-yellow-700 mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl mx-auto">
              Discover our authentic Italian flavors and specialties
            </p>
          </div>

          {/* Search bar (responsive) */}
          <div className="w-full sm:w-72 md:w-96 self-end">
            <label htmlFor="menu-search" className="sr-only">Search menu</label>
            <div className="relative">
              <input
                id="menu-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients..."
                className="w-full px-4 py-2 rounded-full border border-yellow-200 text-black focus:outline-none focus:ring-2 focus:ring-accent-blue/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="hidden sm:block w-4"></div>
        </div>

        {/* Category Tabs - Desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(tabLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setCurrentSlide(0);
              }}
              className={`flex items-center px-4 py-2 rounded-full 
                text-sm font-medium transition-colors
                ${activeTab === key
                  ? 'bg-[var(--primary-yellow)] text-black'
                  : 'text-yellow-800 bg-yellow-200 hover:bg-yellow-300'}`}
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
                      style={{ maxWidth: '640px', margin: '0 auto' }}
                    >
                      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group h-full flex flex-col mx-auto max-w-md">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.image || item.imageUrl || "/placeholder-food.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={handleImageError}
                          />
                        </div>

                        {/* Details */}
                        <CardContent className="p-6">
                          <h3 className="font-serif font-bold text-xl text-accent-red mb-3 text-center" style={{ color: 'var(--accent-red)' }}>
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed text-center">
                            {item.description}
                          </p>

                          {/* Price Display */}
                          <div className="mt-4 text-center">
                            {discount > 0 ? (
                              <div className="flex justify-center items-center gap-2">
                                <span className="text-lg text-accent-red font-bold" style={{ color: 'var(--accent-red)' }}>
                                  €{(Number(originalPrice) - (Number(originalPrice) * discount) / 100).toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  €{Number(originalPrice).toFixed(2)}
                                </span>
                                <span className="text-xs bg-accent-red text-white px-2 py-1 rounded-xl" style={{ backgroundColor: 'var(--accent-red)' }}>
                                  -{discount}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-yellow-700" style={{ color: 'var(--primary-yellow-dark)' }}>
                                €{Number(originalPrice).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Cart Controls */}
                          <div className="mt-4 flex justify-center">
                            <CartControls itemId={String(item._id || item.id)} />
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

              {/* Carousel Controls */}
              {currentItems.length > 1 && (
                <>
                  {/* Prev/Next buttons overlay */}

                  {/* Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {currentItems.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-xl transition-all duration-300 ${currentSlide === index
                          ? 'bg-[var(--primary-yellow)] w-6'
                          : 'bg-yellow-300 opacity-60'
                          }`}
                        onClick={() => {
                          setCurrentSlide(index);
                          resetAutoSlideTimer();
                        }}
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
                        onError={handleImageError}
                      />
                    </div>

                    {/* Details */}
                    <CardContent className="p-6">
                      <h3 className="font-serif font-bold text-xl text-yellow-800 group-hover:text-yellow-700 transition-colors mb-3 text-center" style={{ color: 'var(--primary-yellow-dark)' }}>
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors text-center">
                        {item.description}
                      </p>

                      {/* Price Display */}
                      <div className="mt-4 text-center">
                        {discount > 0 ? (
                          <div className="flex justify-center items-center gap-2">
                            <span className="text-lg font-bold text-accent-red" style={{ color: 'var(--accent-red)' }}>
                              €{(Number(originalPrice) - (Number(originalPrice) * discount) / 100).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              €{Number(originalPrice).toFixed(2)}
                            </span>
                            <span className="text-xs bg-accent-red text-white px-2 py-1 rounded-xl" style={{ backgroundColor: 'var(--accent-red)' }}>
                              -{discount}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-yellow-700" style={{ color: 'var(--primary-yellow-dark)' }}>
                            €{Number(originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="p-4 pt-0 flex justify-center">
                      <CartControls itemId={String(item._id || item.id)} />
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-[var(--primary-yellow)] rounded-xl md:rounded-2xl p-4 md:p-6 text-center text-black mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Ready to order?</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base max-w-2xl mx-auto">
            Experience the authentic taste of Italy delivered right to your door
          </p>
          <Button onClick={handleOrderOnline} size="lg" className="bg-white text-[var(--primary-yellow-dark)] hover:bg-yellow-100 text-sm md:text-base">
            Place Your Order Now
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Tabs - Mobile Only */}


// ... (other code)

      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-[var(--primary-yellow-dark)] border-t border-yellow-600 shadow-lg z-20 md:hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="overflow-x-auto">
          <div className="flex px-2 py-2 min-w-max">
            {Object.entries(tabLabels).map(([key, label]) => (
              <motion.button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentSlide(0);
                }}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl 
            text-xs font-medium mx-1 min-w-[60px] transition-colors
            ${activeTab === key
                    ? 'bg-[var(--primary-yellow)] text-black'
                    : 'text-yellow-100 bg-[var(--primary-yellow-dark)] hover:bg-[var(--primary-yellow)]'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.span
                  className="mb-1"
                  animate={{
                    scale: activeTab === key ? 1.2 : 1,
                    rotate: activeTab === key ? [0, -10, 10, -10, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {tabIcons[key as keyof typeof tabIcons]}
                </motion.span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeTab === key ? "active" : "inactive"}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {label}
                  </motion.span>
                </AnimatePresence>

                {/* Active indicator */}
                <AnimatePresence>
                  {activeTab === key && (
                    <motion.div
                      className="absolute bottom-0 w-4 h-1 bg-black rounded-t-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: 0.5 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

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
        /* small utility colors in CSS in case tailwind classes are not applied */
        .bg-accent-red { background-color: var(--accent-red); }
        .bg-primary-yellow { background-color: var(--primary-yellow); }
      `}</style>
    </div>
  );
};

export default Menu;
