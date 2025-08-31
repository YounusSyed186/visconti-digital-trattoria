'use client'

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DayPickerProvider } from "react-day-picker";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Define initialProps to configure the DayPickerProvider
  const initialProps = {
    selected: new Date(), // Initial selected date (can be customized)
    // You can add other properties here as required for your DayPicker configuration
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DayPickerProvider initialProps={initialProps}>
          {children}
        </DayPickerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}