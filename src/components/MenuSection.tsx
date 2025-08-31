import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios to make HTTP requests
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState<string>("pizze-tradizionali");
  const [menuItems, setMenuItems] = useState<{ [key: string]: any[] }>({}); // Updated state for grouped categories
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState<string | null>(null); // To capture errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
        console.log('Fetched menu items:', response.data);

        if (response.data && response.data.groupedItems) {
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


  // Define the labels for the tabs based on categories
  const tabLabels = {
    "pizze-tradizionali": "🍕 Pizze Tradizionali",
    "pizze-speciali": "⭐ Pizze Speciali",
    "calzoni": "🥟 Calzoni",
    "kebab-panini": "🥙 Kebab & Panini",
    "burgers": "🍔 Burgers & Sides",
    "bibite": "🥤 Bibite",
  };

  const handleShowFullMenu = (category: string): void => {
    navigate(`/menu/full/${category}`, {
      state: { category, items: menuItems[category], categoryLabel: tabLabels[category] }
    });
  };

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message

  return (
    <section id="menu" className="py-12 md:py-20 px-4 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gold mb-4">
            La Nostra Menu
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Scopri i nostri piatti autentici, preparati con ingredienti freschi e passione italiana
          </p>
          <Button
            onClick={() => navigate('/menu')}
            variant="outline"
            className="border-gold text-gold hover:bg-gold hover:text-black font-medium"
          >
            Vedi Menu Completo
          </Button>
        </div>

        {/* Menu Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full overflow-x-auto pb-2 mb-8 bg-card border border-border rounded-md">
            {Object.entries(tabLabels).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-gold data-[state=active]:text-black font-medium"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Ensure items is an array before applying slice */}
                {Array.isArray(items) && items.slice(0, 6).map((item, index) => (
                  <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/50 transition-all duration-300 hover:shadow-warm group overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                         src={item.image || item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-gold text-black font-bold py-1 px-2 rounded-md text-sm">
                        {item.price}
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-serif font-semibold text-base sm:text-lg text-foreground group-hover:text-gold transition-colors mb-2">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Show Full Menu Button */}
              {items.length && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => handleShowFullMenu(category)}
                    className="bg-gold text-black hover:bg-black hover:text-gold font-medium py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Show Full Menu
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default MenuSection;
