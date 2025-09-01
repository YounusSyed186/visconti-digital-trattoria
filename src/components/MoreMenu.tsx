import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { MenuListingPageProps, MenuItem } from '@/types/menu';

const MenuListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, items, categoryLabel } = location.state as MenuListingPageProps;

  if (!category || !items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No menu data available. Please go back to the menu.</p>
        <Button onClick={() => navigate('/')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-stone-100 relative">
      <div className="max-w-4xl mx-auto relative">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center mr-4 bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-stone-800 border-b-2 border-amber-600 pb-1">
            {categoryLabel || "Menu Items"}
          </h1>
        </div>

        {/* Menu Items Grid */}
        <div className="space-y-6">
          {items.map((item: MenuItem, index: number) => (
            <Card 
              key={index}
              className="bg-white border-none shadow-none overflow-hidden"
            >
              <CardContent className="p-0 flex">
                <div className="w-1/3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-stone-600 text-sm mb-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-amber-700 font-bold text-lg">
                    {item.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer information */}
        <div className="mt-12 pt-6 border-t border-stone-300 text-center text-stone-600 text-sm">
          <p>harmmafullahbangash25@gmail.com</p>
          <p className="my-1">Q335-Q965617</p>
          <p>123 Anywhere St., Any City</p>
        </div>
      </div>
    </div>
  );
};

export default MenuListingPage;