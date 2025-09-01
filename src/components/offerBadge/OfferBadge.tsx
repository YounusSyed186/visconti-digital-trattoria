import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Offer = {
  occasion: string;
  date: string; // ISO string
  discount: number; // percentage
  name: string;
};

type Props = {
  offer?: Offer;
  fetchUrl?: string;
  className?: string;
};

export default function OfferBadge({ offer: initialOffer, fetchUrl, className = "" }: Props) {
  const dummyData: Offer = {
    occasion: "Chef's Special",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    discount: 20,
    name: "Steak Night",
  };

  const [offer, setOffer] = useState<Offer | null>(initialOffer ?? dummyData);
  const [loading, setLoading] = useState<boolean>(!!fetchUrl && !initialOffer);
  const [error, setError] = useState<string | null>(null);
  const [showBurst, setShowBurst] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (fetchUrl && !initialOffer) {
      setLoading(true);
      fetch(fetchUrl)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Network error: ${res.status}`);
          return (await res.json()) as Offer;
        })
        .then((data) => {
          if (!cancelled) {
            setOffer(data);
            setLoading(false);
          }
        })
        .catch((err: any) => {
          if (!cancelled) {
            setError(err.message ?? "Failed to load offer");
            setLoading(false);
          }
        });
    }
    return () => {
      cancelled = true;
    };
  }, [fetchUrl, initialOffer]);

  if (loading) {
    return (
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl shadow-md bg-neutral-900 text-gray-300 animate-pulse ${className}`}
      >
        <div className="h-5 w-5 animate-pulse rounded-full bg-gray-700" />
        <div className="text-sm">Loading offer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl shadow-md bg-red-900/50 text-red-300 ${className}`}
      >
        <div className="text-sm">{error}</div>
      </div>
    );
  }

  if (!offer) return null;

  const expiresAt = new Date(offer.date);
  const now = new Date();
  const msLeft = Math.max(0, expiresAt.getTime() - now.getTime());
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));

  const formattedDate = isNaN(expiresAt.getTime())
    ? "Invalid date"
    : expiresAt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <>
      {/* Enhanced burst animation starting from borders */}
      {showBurst && (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
          {/* Border particles coming from edges */}
          {Array.from({ length: 16 }).map((_, i) => {
            // Determine starting position from different edges
            const edge = i % 4; // 0: top, 1: right, 2: bottom, 3: left
            let startX, startY;
            
            switch(edge) {
              case 0: // top
                startX = Math.random() * window.innerWidth;
                startY = -50;
                break;
              case 1: // right
                startX = window.innerWidth + 50;
                startY = Math.random() * window.innerHeight;
                break;
              case 2: // bottom
                startX = Math.random() * window.innerWidth;
                startY = window.innerHeight + 50;
                break;
              case 3: // left
                startX = -50;
                startY = Math.random() * window.innerHeight;
                break;
              default:
                startX = 0;
                startY = 0;
            }
            
            const size = 10 + Math.random() * 15;
            const duration = 1.5 + Math.random() * 0.5;
            const delay = Math.random() * 0.4;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-red-500"
                style={{
                  width: size,
                  height: size,
                  top: startY,
                  left: startX,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0.8, 0],
                  opacity: [0, 1, 0.8, 0],
                  x: window.innerWidth/2 - startX,
                  y: window.innerHeight/2 - startY,
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  ease: "easeOut",
                }}
                onAnimationComplete={() => {
                  if (i === 15) setShowBurst(false);
                }}
              />
            );
          })}
          
          {/* Central flash that appears after particles */}
          <motion.div
            className="absolute rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 20, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            style={{ width: 30, height: 30 }}
          />
        </div>
      )}

      {/* Offer Badge with border entrance animation */}
      <motion.article
        aria-label={`Offer: ${offer.name}`}
        initial={{ 
          scale: 0.8,
          opacity: 0,
          boxShadow: "0 0 0 0 rgba(255,215,0,0)"
        }}
        animate={{ 
          scale: 1,
          opacity: 1,
          boxShadow: [
            "0 0 0 0 rgba(255,215,0,0)",
            "0 0 0 10px rgba(255,215,0,0.3)",
            "0 0 0 20px rgba(255,215,0,0.1)",
            "0 0 20px rgba(255,215,0,0.15)"
          ]
        }}
        transition={{ 
          duration: 1.2,
          ease: "easeOut",
          boxShadow: {
            duration: 1.5,
            ease: "easeOut"
          }
        }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`fixed top-20 right-4 z-50 
          flex items-center gap-4 p-4 
          rounded-2xl w-full max-w-[80%] sm:w-[350px] 
          border border-amber-400/30 
          bg-gradient-to-br from-zinc-900 via-neutral-800 to-zinc-900 
          text-gray-100 overflow-visible ${className}`}
      >
        {/* Discount Circle with border animation */}
        <motion.div
          className="relative flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full 
          bg-gradient-to-tr from-amber-500 via-red-500 to-orange-500 shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          style={{
            boxShadow: "0 0 0 0 rgba(255,140,0,0)"
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 0 5px rgba(255,140,0,0.3)"
          }}
        >
          <motion.div 
            className="text-white text-lg font-extrabold leading-none drop-shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {offer.discount}%
          </motion.div>
          <motion.span 
            className="absolute -bottom-1 -right-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-black/70 text-amber-300 border border-amber-400/40"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            OFF
          </motion.span>
        </motion.div>

        {/* Text with staggered animation */}
        <div className="min-w-0">
          <motion.h3 
            className="text-sm font-bold text-amber-300 truncate"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {offer.name}
          </motion.h3>
          <motion.p 
            className="text-xs text-gray-400 truncate"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {offer.occasion}
          </motion.p>

          <motion.div 
            className="mt-2 flex items-center gap-3 text-gray-400"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-xs">Expires: {formattedDate}</div>
            <div className="h-1 w-px bg-gray-600" />
            <div
              className={`text-xs font-medium ${daysLeft === 0 ? "text-red-400" : "text-amber-400"}`}
            >
              {isNaN(msLeft)
                ? "--"
                : daysLeft > 1
                ? `${daysLeft} days left`
                : daysLeft === 1
                ? `1 day left`
                : `Ends today`}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          className="ml-auto"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          <button
            type="button"
            className="rounded-lg px-3 py-1 text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 shadow-md hover:scale-[1.05] transition-transform"
            onClick={() => {
              window.location.href = `/offers?name=${encodeURIComponent(offer.name)}`;
            }}
          >
            Grab
          </button>
        </motion.div>
      </motion.article>
    </>
  );
}