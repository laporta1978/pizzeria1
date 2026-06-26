import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '@/lib/pizzaData';
import { useProducts } from '@/lib/useProducts';
import PizzaCard from '@/components/PizzaCard';
import { Search, X } from 'lucide-react';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [query, setQuery] = useState('');

  const { products: pizzasWithStock, loading: stockLoading } = useProducts();
  const filtered = pizzasWithStock.filter(p => {
    const matchesCategory = activeCategory === 'todas' || p.category === activeCategory;
    const q = query.toLowerCase().trim();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            El Catálogo
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4">
            Nuestro Menú
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Cada pizza, una historia. Ingredientes seleccionados a mano, masa de fermentación lenta y el calor del horno de leña.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative mb-6 max-w-md"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre o ingrediente..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-10 rounded-full bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-border transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-10 overflow-x-auto pb-2"
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wider uppercase whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
            <p className="text-4xl mb-4">🍕</p>
            <p className="text-foreground font-semibold text-lg mb-1">Sin resultados</p>
            <p className="text-muted-foreground text-sm">Prueba con otro nombre o ingrediente</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((pizza, i) => (
              <PizzaCard key={pizza.id} pizza={pizza} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}