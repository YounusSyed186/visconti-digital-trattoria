import React, { useEffect, useState } from "react";
import OfferBadge from "./OfferBadge"; // the animated badge

type Offer = {
  _id: string;
  title: string;
  description?: string;
  discount: number;
  expiryDate: string;   // ✅ use backend field
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function OfferBadgeFetcher() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}api/offer-badges`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch offers");
        return await res.json();
      })
      .then((data: Offer[]) => {
        // ✅ pick first active + not expired offer
        const now = new Date();
        const active = data.find(
          (o) => o.isActive && new Date(o.expiryDate) > now
        );
        if (active) setOffer(active);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading || error || !offer) return null; // fail silent if no offers

  return (
    <OfferBadge
      className="w-100"
      offer={{
        name: offer.title,
        occasion: offer.description ?? "",
        date: offer.expiryDate, // ✅ use expiryDate from backend
        discount: offer.discount,
      }}
    />
  );
}
