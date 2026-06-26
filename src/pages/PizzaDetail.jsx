import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, ShoppingBag, Flame, Leaf, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/lib/useProducts';
import { useCart } from '@/lib/cartContext';
import { toast } from 'sonner';

export default function PizzaDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const [pizza, setPizza] = useState(null);
  useEffect(() => {
    if (products.length > 0) setPizza(products.find(p => p.id === id) || null);
  }, [products, id]);
  const { addItem, setIsOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState(1); // Mediana by default
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {

  }, [id]);

  if (!pizza) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-display text-foreground">Pizza no encontrada</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/menu"><ArrowLeft className="w-4 h-4 mr-2" /> Volver al menú</Link>
        </Button>
      </div>
    );
  }

  const currentSize = pizza.sizes[selectedSize];

  const handleAddToCart = () => {
    addItem(pizza, currentSize.name, quantity);
    toast.success(`${pizza.name} (${currentSize.name}) añadida al carrito`, {
      action: {
        label: 'Ver carrito',
        onClick: () => setIsOpen(true),
      },
    });
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al menú
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-card border border-border/50">
              <img
                src={pizza.image}
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Tags */}
            <div className="absolute top-4 left-4 flex gap-2">
              {pizza.spicy && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                  <Flame className="w-3.5 h-3.5" /> Picante
                </span>
              )}
              {pizza.vegetarian && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  <Leaf className="w-3.5 h-3.5" /> Veggie
                </span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-col"
          >
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              {pizza.subtitle}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {pizza.name}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              {pizza.description}
            </p>

            {/* Stock */}
            <div className="mb-8">
              {pizza.stock === 0 ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-xl text-sm font-semibold text-destructive">
                  <Package className="w-4 h-4" /> Sin stock disponible
                </span>
              ) : pizza.stock <= 5 ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm font-semibold text-amber-400">
                  <Package className="w-4 h-4" /> ¡Solo quedan {pizza.stock}!
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm font-semibold text-emerald-400">
                  <Package className="w-4 h-4" /> Disponible ({pizza.stock} en stock)
                </span>
              )}
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Ingredientes
              </h3>
              <div className="flex flex-wrap gap-2">
                {pizza.ingredients.map(ing => (
                  <span
                    key={ing}
                    className="px-3 py-1.5 bg-secondary text-foreground text-sm rounded-full border border-border/50"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Tamaño
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {pizza.sizes.map((size, i) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(i)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedSize === i
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <span className="block text-lg font-bold text-foreground">
                      {size.inches}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {size.name}
                    </span>
                    <span className="block text-sm font-semibold text-primary mt-1">
                      ${size.price.toLocaleString('es-AR')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4 bg-secondary rounded-xl px-4 h-14">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={pizza.stock === 0}
                className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold group disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {pizza.stock === 0 ? 'Sin stock' : `Añadir — $${(currentSize.price * quantity).toLocaleString('es-AR')}`}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}