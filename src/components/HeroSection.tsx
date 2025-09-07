import heroImage from "@/assets/Bg1.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const glowVariants = {
  initial: { 
    textShadow: "0 0 5px rgba(255,215,0,0.5)" 
  },
  animate: {
    textShadow: [
      "0 0 5px rgba(255,215,0,0.5)",
      "0 0 15px rgba(255,215,0,0.7)",
      "0 0 5px rgba(255,215,0,0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    menuSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Decorative Pulses with Framer Motion */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-20 sm:w-32 h-20 sm:h-32 bg-yellow/20 rounded-full blur-3xl"
        variants={pulseVariants}
        animate="animate"
      ></motion.div>
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-wine/30 rounded-full blur-2xl"
        variants={pulseVariants}
        animate="animate"
        initial={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
      ></motion.div>

      {/* Content with staggered animations */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <div className="mb-6 sm:mb-10">
          <motion.h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold text-gradient-gold mb-4 sm:mb-6 leading-tight"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          >
            {t("heroSection.title")}
          </motion.h1>
          <motion.div 
            className="w-20 sm:w-32 h-1 bg-gradient-gold mx-auto mb-4 sm:mb-6 rounded-full"
            variants={itemVariants}
          ></motion.div>
          <motion.p 
            className="text-lg sm:text-2xl md:text-3xl font-light text-warm-white tracking-wide"
            variants={itemVariants}
          >
            {t("heroSection.subtitle")}
          </motion.p>
        </div>

        {/* Tagline */}
        <motion.p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-warm-white/90 mb-8 sm:mb-12 font-light leading-relaxed max-w-2xl sm:max-w-3xl mx-auto"
          variants={itemVariants}
        >
          {t("heroSection.tagline")}
        </motion.p>

        {/* Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="premium"
              size="lg"
              className="w-full sm:w-auto group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                <motion.span 
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl sm:text-2xl"
                >
                  🛵
                </motion.span>
                {t("heroSection.orderOnline")}
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="glass"
              size="lg"
              onClick={() => navigate("/menuPhy")}
              className="w-full sm:w-auto border-2 border-gold/50 text-gold hover:bg-yellow/10 hover:border-gold group"
            >
              <span className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="text-lg sm:text-xl"
                >
                  📋
                </motion.span>
                {t("heroSection.viewMenu")}
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="glass"
              size="lg"
              onClick={() => navigate("/menu")}
              className="w-full sm:w-auto border-2 border-gold/50 text-gold hover:bg-yellow/10 hover:border-gold group"
            >
              <span className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl">
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="text-lg sm:text-xl"
                >
                  📜
                </motion.span>
                {t("heroSection.viewOnlineMenu")}
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Order Platforms */}
        <motion.div 
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-warm-white/80"
          variants={itemVariants}
        >
          <span className="text-sm sm:text-base font-medium">
            {t("heroSection.orderVia")}
          </span>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {["justEat", "deliveroo", "Glovo"].map((platform, idx) => (
              <motion.span
                key={idx}
                className="px-4 sm:px-6 py-2 sm:py-3 glass-card rounded-full text-xs sm:text-sm font-medium hover-glow cursor-pointer group"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255,215,0,0.1)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  {platform === "justEat" && (
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                    >
                      📱
                    </motion.span>
                  )}
                  {platform === "deliveroo" && (
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                    >
                      🛵
                    </motion.span>
                  )}
                  {platform}
                </span>
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Optional addition */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-gold rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;