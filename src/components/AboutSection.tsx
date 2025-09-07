import { Card } from "@/components/ui/card";
import foodCollage from "@/assets/food-collage.jpg";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AboutSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 px-4 bg-yellow-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <motion.div 
          className="absolute top-1/4 left-1/6 w-64 h-64 bg-wine rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/3 right-1/6 w-48 h-48 bg-gold rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        ></motion.div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          
          <div className="space-y-6">
            <motion.h2 
              className="text-4xl md:text-5xl font-serif font-bold text-black mb-6"
              variants={itemVariants}
            >
              {t("aboutSection.heading")}
            </motion.h2>
            
            <motion.div variants={itemVariants}>
              <Card className="glass-card p-8 shadow-elegant hover-lift">
                <p className="text-xl text-foreground/90 leading-relaxed mb-8 font-light">
                  {t("aboutSection.description")}
                </p>
                
                <motion.div 
                  className="grid grid-cols-2 gap-6 mt-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl border border-gold/30 hover-glow group"
                    variants={statVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform">
                      {t("aboutSection.stats.yearsExperience.value")}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {t("aboutSection.stats.yearsExperience.label")}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-wine/20 to-wine/5 rounded-xl border border-wine/30 hover-glow group"
                    variants={statVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl font-bold text-wine-light mb-2 group-hover:scale-110 transition-transform">
                      {t("aboutSection.stats.halalCertified.value")}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {t("aboutSection.stats.halalCertified.label")}
                    </div>
                  </motion.div>
                </motion.div>
              </Card>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <motion.div 
                className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                  <span className="text-black text-lg">🍕</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-gold transition-colors">{t("aboutSection.features.authItalianRecipes")}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-wine rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-warm">
                  <span className="text-white text-lg">🥙</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-wine-light transition-colors">{t("aboutSection.features.freshKebabs")}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                  <span className="text-black text-lg">🚚</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-gold transition-colors">{t("aboutSection.features.fastDelivery")}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4 p-4 glass-card rounded-lg hover-glow group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-wine rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-warm">
                  <span className="text-white text-lg">⭐</span>
                </div>
                <span className="text-foreground font-medium group-hover:text-wine-light transition-colors">{t("aboutSection.features.premiumQuality")}</span>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative"
            variants={imageVariants}
          >
            <motion.div 
              className="relative overflow-hidden rounded-3xl shadow-elegant hover-lift group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img 
                src={foodCollage} 
                alt={t("aboutSection.heading")}
                className="w-full h-[450px] object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:from-black/40 transition-all duration-300"></div>
              
              <motion.div 
                className="absolute bottom-8 left-8 right-8"
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="glass-card px-6 py-4 rounded-2xl hover-glow group/badge">
                  <div className="flex items-center gap-3">
                    <motion.span 
                      className="text-2xl"
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ delay: 1, duration: 0.5 }}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                    >
                      🏆
                    </motion.span>
                    <span className="text-gold font-bold text-lg">{t("aboutSection.features.badge")}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="absolute -top-6 -right-6 w-full h-full border-2 border-gold/20 rounded-3xl -z-10"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-6 -left-6 w-full h-full border-2 border-wine/20 rounded-3xl -z-20"
              animate={{ 
                y: [0, 10, 0],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;