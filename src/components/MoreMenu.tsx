import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Star, Clock } from 'lucide-react';
import { MenuListingPageProps, MenuItem } from '@/types/menu';
import { useState } from 'react';

const MenuListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, items, categoryLabel } = location.state as MenuListingPageProps;
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  if (!category || !items) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🍽️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Menu Not Available</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">We're sorry, but the menu data couldn't be loaded. Please try again.</p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate(-1)}
                className="group border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </Button>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                  {categoryLabel || "Our Menu"}
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mt-2 rounded-full"></div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-xl border border-amber-200">
                <span className="text-sm font-medium text-amber-800">
                  {items.length} delicious item{items.length !== 1 ? 's' : ''} available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item: MenuItem, index: number) => (
            <Card 
              key={index}
              className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f9fafb'/%3E%3Ccircle cx='200' cy='150' r='50' fill='%23e5e7eb'/%3E%3C/svg%3E";
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg">{item.price}</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button 
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm text-amber-700 hover:bg-white hover:text-amber-800 rounded-full shadow-lg border border-amber-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors duration-300 mb-2 font-serif leading-tight">
                      {item.name}
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-20 transition-all duration-300"></div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors">
                    {item.description}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>15-20 min</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Available</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl py-3 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Order - {item.price}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information Footer */}
        <div className="mt-20 pt-12 border-t border-amber-200">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto text-center shadow-lg border border-amber-200/50">
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Visit Our Restaurant</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <a href="mailto:harmmafullahbangash25@gmail.com" className="text-amber-600 hover:text-amber-700 transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <span className="text-gray-600">Q335-Q965617</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Location</p>
                  <span className="text-gray-600">123 Anywhere St.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuListingPage;