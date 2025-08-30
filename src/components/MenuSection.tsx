import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState("pizze-tradizionali");

  const menuItems = {
    "pizze-tradizionali": [
      { name: "Margherita", description: "Pomodoro, mozzarella", price: "€5,50" },
      { name: "Napoli", description: "Pomodoro, mozzarella, acciughe, origano", price: "€6,50" },
      { name: "4 Stagioni", description: "Pomodoro, mozzarella, funghi, prosciutto cotto, carciofi, salsiccia", price: "€7,50" },
      { name: "Capricciosa", description: "Pomodoro, mozzarella, funghi, prosciutto cotto, carciofi", price: "€7,00" },
      { name: "Diavola", description: "Pomodoro, mozzarella, salame piccante", price: "€6,50" },
      { name: "Prosciutto e Funghi", description: "Pomodoro, mozzarella, prosciutto cotto, funghi", price: "€7,00" },
    ],
    "pizze-speciali": [
      { name: "Visconti Special", description: "Pomodoro, mozzarella, prosciutto crudo, rucola, grana", price: "€9,00" },
      { name: "Kebab Pizza", description: "Pomodoro, mozzarella, kebab, cipolla, peperoni", price: "€8,50" },
      { name: "Vegetariana", description: "Pomodoro, mozzarella, verdure grigliate, olive", price: "€7,50" },
      { name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, parmigiano, fontina", price: "€8,00" },
      { name: "Bufalina", description: "Pomodoro, mozzarella di bufala, basilico", price: "€8,50" },
    ],
    "calzoni": [
      { name: "Calzone Classico", description: "Pomodoro, mozzarella, prosciutto cotto, funghi", price: "€7,50" },
      { name: "Calzone Kebab", description: "Pomodoro, mozzarella, kebab, cipolla", price: "€8,00" },
      { name: "Calzone Vegetariano", description: "Pomodoro, mozzarella, verdure miste", price: "€7,00" },
    ],
    "kebab-panini": [
      { name: "Panino Kebab", description: "Carne di kebab, insalata, pomodoro, cipolla, salse", price: "€6,00" },
      { name: "Piadina Kebab", description: "Carne di kebab in piadina calda", price: "€6,00" },
      { name: "Panino Falafel", description: "Falafel, verdure fresche, salse", price: "€5,50" },
      { name: "Piatto Kebab", description: "Kebab servito con patatine e insalata", price: "€10,00" },
      { name: "Dürüm", description: "Kebab avvolto in pane sottile", price: "€6,50" },
    ],
    "burgers": [
      { name: "Chicken Burger", description: "Pollo grigliato, insalata, pomodoro", price: "€5,50" },
      { name: "Doner Box", description: "Kebab con patatine nella box", price: "€7,00" },
      { name: "Alette di Pollo", description: "5 pezzi di ali di pollo", price: "€5,50" },
      { name: "Onion Rings", description: "10 pezzi di anelli di cipolla", price: "€4,00" },
      { name: "Patatine Fritte (M)", description: "Porzione media", price: "€2,00" },
      { name: "Patatine Fritte (L)", description: "Porzione large", price: "€3,00" },
    ],
    "bibite": [
      { name: "Lattina 33cl", description: "Coca Cola, Fanta, Sprite", price: "€2,00" },
      { name: "Bottiglia 50cl", description: "Varie bibite", price: "€3,00" },
      { name: "Red Bull", description: "Energy drink 250ml", price: "€3,00" },
      { name: "Energy Drink", description: "Vari gusti", price: "€3,50" },
      { name: "Acqua 50cl", description: "Acqua naturale/frizzante", price: "€1,00" },
    ],
  };

  const tabLabels = {
    "pizze-tradizionali": "🍕 Pizze Tradizionali",
    "pizze-speciali": "⭐ Pizze Speciali",
    "calzoni": "🥟 Calzoni",
    "kebab-panini": "🥙 Kebab & Panini",
    "burgers": "🍔 Burgers & Sides",
    "bibite": "🥤 Bibite",
  };

  return (
    <section id="menu" className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 text-9xl">🍕</div>
        <div className="absolute bottom-1/3 right-1/4 text-8xl">🥙</div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-4">
            La Nostra Menu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scopri i nostri piatti autentici, preparati con ingredienti freschi e passione italiana
          </p>
        </div>

        {/* Menu Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8 bg-card border border-border">
            {Object.entries(tabLabels).map(([key, label]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="text-xs md:text-sm data-[state=active]:bg-gold data-[state=active]:text-black font-medium"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/50 transition-all duration-300 hover:shadow-warm group"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif font-semibold text-lg text-foreground group-hover:text-gold transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-gold font-bold text-lg ml-2 flex-shrink-0">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Special Note */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-gold text-black p-6 shadow-gold max-w-2xl mx-auto">
            <h3 className="font-serif font-bold text-xl mb-2">Offerta Speciale</h3>
            <p className="font-medium">
              Ogni 5 Pizze = 1 Bottiglia da 1.5L in Omaggio! 🎉
            </p>
            <p className="text-sm mt-2 opacity-90">
              Consegna gratuita per ordini sopra €8, altrimenti solo €2
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;