'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useEffect, useState } from 'react';

export default function FullMenuPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoryLabel, setCategoryLabel] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch the data based on the category
    // For now, we'll use mock data or redirect back if no data
    const mockItems: MenuItem[] = [
      {
        name: 'Margherita',
        description: 'Pomodoro, mozzarella, basilico',
        price: '€8.50',
        image: '/api/placeholder/300/200'
      },
      {
        name: 'Quattro Stagioni',
        description: 'Pomodoro, mozzarella, funghi, prosciutto, carciofi, olive',
        price: '€12.00',
        image: '/api/placeholder/300/200'
      }
    ];

    setItems(mockItems);
    setCategoryLabel(`🍕 ${params.category.replace('-', ' ')}`);
  }, [params.category]);

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No menu data available. Please go back to the menu.</p>
        <Button onClick={() => router.push('/')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 text-7xl md:text-9xl">🍕</div>
        <div className="absolute bottom-1/3 right-1/4 text-6xl md:text-8xl">🥙</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gold">
            {categoryLabel || "Menu Items"}
          </h1>
        </div>

        {/* Menu Items Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: MenuItem, index: number) => (
            <Card 
              key={index}
              className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/50 transition-all duration-300 hover:shadow-warm group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
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
      </div>
    </div>
  );
}