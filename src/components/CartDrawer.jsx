import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cartContext';
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FREE_SHIPPING_THRESHOLD = 15000;

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 1200;
  const grandTotal = totalPrice + shipping;
  const progress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-[420px] flex flex-col p-0 gap-0">

        {/* Header */}
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/60">
          <SheetTitle className="font-display text-2xl text-foreground flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-primary" />
            </div>
            Tu Pedido
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="ml-auto text-sm font-body font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                  {totalItems} {totalItems === 1 ? 'pizza' : 'pizzas'}
                </motion.span>
              )}
            </AnimatePresence>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center"
            >
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
            </motion.div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">El carrito está vacío</p>
              <p className="text-sm text-muted-foreground">Añade tus pizzas favoritas para empezar</p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              className="rounded-full border-primary text-primary bg-transparent border hover:bg-primary hover:text-primary-foreground transition-colors"
              asChild
            >
              <Link to="/menu" className="flex items-center gap-2">
                Ver el Menú <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-3 bg-secondary/50 border-b border-border/40">
              {remaining > 0 ? (
                <div className="flex items-center gap-3">
                  <Gift className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Añade <span className="text-foreground font-semibold">${remaining.toLocaleString('es-AR')}</span> más para envío gratis
                    </p>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Gift className="w-4 h-4" />
                  <p className="text-xs font-semibold">¡Envío gratis desbloqueado!</p>
                </div>
              )}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              <AnimatePresence initial={false}>
                {items.map(item => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, x: 60, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 60, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="flex gap-3 p-3 rounded-2xl bg-card border border-border/60 hover:border-border transition-colors group"
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <h4 className="font-semibold text-sm text-foreground truncate leading-tight">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty control */}
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.4 }}
                            animate={{ scale: 1 }}
                            className="text-xs font-bold w-5 text-center tabular-nums"
                            style={{ color: '#FACC15' }}
                          >
                            {item.quantity}
                          </motion.span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Price */}
                        <span className="text-sm font-bold text-primary tabular-nums">
                          ${(item.price * item.quantity).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="self-start mt-0.5 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer summary */}
            <div className="px-5 pb-6 pt-4 border-t border-border/60 bg-card/50 space-y-3">
              {/* Line items */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium tabular-nums">${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <AnimatePresence mode="wait">
                    {shipping === 0 ? (
                      <motion.span
                        key="free"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-emerald-400 font-semibold"
                      >
                        Gratis
                      </motion.span>
                    ) : (
                      <motion.span
                        key="paid"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-foreground font-medium tabular-nums"
                      >
                        ${shipping.toLocaleString('es-AR')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline pt-3 border-t border-border/60">
                <span className="text-foreground font-bold text-base">Total</span>
                <motion.span
                  key={grandTotal}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-primary font-bold text-2xl tabular-nums"
                >
                  ${grandTotal.toLocaleString('es-AR')}
                </motion.span>
              </div>

              {/* CTA */}
              <Button
                className="w-full h-13 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl mt-1 group"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  Finalizar Pedido
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}