import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Leaf, Check, Package } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { Link } from 'react-router-dom';

export default function PizzaCard({ pizza, index }) {
  const { addItem, setIsOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [currentStock] = useState(pizza.stock ?? 99);

  useEffect(() => {
  }, [pizza.id]);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(pizza, 'Mediana');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    // briefly open the cart
    setTimeout(() => setIsOpen(true), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/pizza/${pizza.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-10px_hsl(18,100%,50%,0.15)]">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <motion.img
              src={pizza.image}
              alt={pizza.name}
              className={`w-full h-full object-cover ${currentStock === 0 ? 'grayscale opacity-40' : ''}`}
              animate={{ scale: isHovered && currentStock > 0 ? 1.08 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            {currentStock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-destructive/90 text-destructive-foreground text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full backdrop-blur-sm">
                  Sin Stock
                </span>
              </div>
            )}

            {/* Tags */}
            <div className="absolute top-3 left-3 flex gap-2">
              {pizza.spicy && (
                <span className="flex items-center gap-1 px-2 py-1 bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                  <Flame className="w-3 h-3" /> Picante
                </span>
              )}
              {pizza.vegetarian && (
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                  <Leaf className="w-3 h-3" /> Veggie
                </span>
              )}
              {currentStock <= 5 && currentStock > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                  <Package className="w-3 h-3" /> ¡Últimas!
                </span>
              )}
            </div>

            {/* Quick-add button with feedback */}
            <AnimatePresence mode="wait">
              {isHovered && currentStock > 0 && (
                <motion.button
                  key="add-btn"
                  onClick={handleQuickAdd}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-colors ${
                    justAdded
                      ? 'bg-emerald-500 text-white'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {justAdded ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="plus"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">
              {pizza.subtitle}
            </p>
            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {pizza.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {pizza.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">
                desde ${pizza.basePrice.toLocaleString('es-AR')}
              </span>
              <span className="text-xs font-medium text-primary border border-primary/30 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Ver más
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}