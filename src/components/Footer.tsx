import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const socialButtonVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const badgeVariants = {
    hover: {
      y: -3,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const certificationVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.8
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.footer 
      className="bg-yellow-100 border-t border-border py-12 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h3 className="text-2xl font-serif font-bold text-black mb-4">
              {t("footer.brand.name")}
            </h3>
            <p className="text-black mb-6 leading-relaxed">
              {t("footer.brand.description")}
            </p>

            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="w-10 h-10 bg-wine rounded-full flex items-center justify-center hover:bg-wine-light transition-colors" 
                aria-label="Facebook"
                variants={socialButtonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="text-white text-sm font-bold">f</span>
              </motion.a>
              <motion.a 
                href="#" 
                className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-dark transition-colors" 
                aria-label="Instagram"
                variants={socialButtonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="text-black text-sm">📷</span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-black mb-4">{t("footer.quickLinks.title")}</h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5 }}>
                <a href="#" className="text-black hover:text-gold transition-colors">{t("footer.quickLinks.home")}</a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="/menu" className="text-black hover:text-gold transition-colors">{t("footer.quickLinks.menu")}</a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="#contact" className="text-black hover:text-gold transition-colors">{t("footer.quickLinks.contact")}</a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a href="#" className="text-black hover:text-gold transition-colors">{t("footer.quickLinks.offers")}</a>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-black mb-4">{t("footer.contactInfo.title")}</h4>
            <div className="space-y-3 text-sm text-black">
              <motion.div whileHover={{ x: 5 }}>
                <p>{t("footer.contactInfo.address")}</p>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <a href="tel:+390382458734" className="hover:text-black transition-colors">{t("footer.contactInfo.phone")}</a>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <p>{t("footer.contactInfo.hours")}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-sm text-black mb-4 md:mb-0">© {currentYear} {t("footer.brand.name")}. Tutti i diritti riservati.</p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-black">{t("footer.orderOnline")}</span>
            <div className="flex space-x-2">
              <motion.span 
                className="px-3 py-1 bg-yellow text-black text-xs font-medium rounded-full cursor-pointer"
                variants={badgeVariants}
                whileHover="hover"
              >
                JustEat
              </motion.span>
              <motion.span 
                className="px-3 py-1 bg-wine text-white text-xs font-medium rounded-full cursor-pointer"
                variants={badgeVariants}
                whileHover="hover"
              >
                Deliveroo
              </motion.span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-6 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={certificationVariants}
          whileHover="hover"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow/10 border border-gold/30 rounded-full">
            <motion.span 
              className="text-xs text-gold"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 2 }}
            >
              🏆
            </motion.span>
            <span className="text-xs text-gold font-medium">{t("footer.certificationBadge")}</span>
            <motion.span 
              className="text-xs text-gold"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 2 }}
            >
              ⭐
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;