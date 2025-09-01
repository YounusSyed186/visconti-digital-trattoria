import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Utensils, Star, Pizza } from 'lucide-react';
import { GiCupcake, GiFullPizza, GiNoodles, GiSandwich } from "react-icons/gi";
import { TbPizzaOff } from "react-icons/tb";
import { MdKebabDining } from "react-icons/md";
import { GiHamburger } from "react-icons/gi";
import { RiDrinksLine } from "react-icons/ri";


const Menu = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [menuItems, setMenuItems] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    "paidina & panino": <GiSandwich className="w-4 h-4" />,   // Panini icon
    "Indian cuisine": <GiNoodles className="w-4 h-4" />,      // Indian food style
    dolco: <GiCupcake className="w-4 h-4" />                  // Dessert icon
  };


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
        if (response.data && response.data.groupedItems && typeof response.data.groupedItems === 'object') {
          setMenuItems(response.data.groupedItems);
        } else {
          setError('API response is not in the expected format');
        }
      } catch (err) {
        setError('Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-warm-700">Loading our delicious menu...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700">
          Go Back Home
        </Button>
      </div>
    </div>
  );

  // For "All" tab, merge all items
  const allItems = Object.values(menuItems).flat();

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-warm-100 py-4 md:py-8 px-3 sm:px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-amber-200 rounded-full -translate-y-12 md:-translate-y-16 translate-x-12 md:translate-x-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-amber-300 rounded-full -translate-x-16 md:-translate-x-20 translate-y-16 md:translate-y-20 opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center mb-6 md:mb-8 gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center bg-amber-600 hover:bg-amber-700 text-white self-start sm:self-auto"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-warm-900 font-serif">
              Our Menu
            </h1>
            <p className="text-warm-700 mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl mx-auto">
              Discover our authentic Italian flavors and specialties
            </p>
          </div>
          <div className="hidden sm:block w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 md:mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* TabsList as Responsive Grid */}
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex min-w-max bg-transparent p-1">
                {Object.entries(tabLabels).map(([key, label]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex flex-col sm:flex-row items-center justify-center px-3 py-2 rounded-full 
                       text-xs sm:text-sm font-medium text-warm-800  border border-amber-200 
                       data-[state=active]:bg-amber-600 data-[state=active]:text-white 
                       whitespace-nowrap transition-colors mx-1 min-w-[70px]"
                  >
                    <span className="mb-1 sm:mb-0 sm:mr-1 md:mr-2">{tabIcons[key as keyof typeof tabIcons]}</span>
                    <span className="hidden xs:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Menu Items Grid */}
            {Object.entries({ all: allItems, ...menuItems }).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-4 sm:mt-6">
                <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.isArray(items) && items.map((item, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden border-0 shadow-md hover:shadow-xl 
                         transition-all duration-300 bg-black group h-full flex flex-col"
                    >
                      <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
                        <img
                          src={item.image || item.imageUrl || "/placeholder-food.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = "/placeholder-food.jpg"; }}
                        />
                        <div className="absolute top-2 right-2 bg-amber-600 text-white font-bold py-1 px-2 rounded-full text-xs shadow-md">
                          {item.price}
                        </div>
                      </div>
                      <CardContent className="p-3 sm:p-4 flex-grow">
                        <h3 className="font-bold text-sm sm:text-base text-warm-900 group-hover:text-amber-700 transition-colors mb-1 sm:mb-2 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-warm-700 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {item.description}
                        </p>
                      </CardContent>
                      <CardFooter className="p-3 sm:p-4 pt-0">
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm">
                          Add to Order
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Footer CTA */}
        <div className="bg-amber-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-center text-white mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Ready to order?</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base max-w-2xl mx-auto">Experience the authentic taste of Italy delivered right to your door</p>
          <Button size="lg" className="bg-white text-amber-700 hover:bg-warm-100 text-sm md:text-base">
            Place Your Order Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;