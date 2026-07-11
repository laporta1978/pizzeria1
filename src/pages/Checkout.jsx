import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, Mail, MessageSquare, Truck, Store, CheckCircle, Tag, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/lib/cartContext';
import { toast } from 'sonner';
import { deductStock } from '@/lib/stockManager';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/api/firebaseClient';

// ─── Cupones disponibles ───────────────────────────────────────────────────────
const COUPONS = {
  'FORNO10':  { type: 'percent', value: 10,   label: '10% de descuento' },
  'FORNO20':  { type: 'percent', value: 20,   label: '20% de descuento' },
  'PIZZA500': { type: 'fixed',   value: 500,  label: '$500 de descuento' },
  'BIENVENIDO': { type: 'percent', value: 15, label: '15% de descuento — Bienvenida' },
};
// ──────────────────────────────────────────────────────────────────────────────

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', notes: ''
  });

  // Cupón
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const shipping = totalPrice >= 15000 ? 0 : 1200;
  const deliveryShipping = deliveryMethod === 'delivery' ? shipping : 0;

  // Calcular descuento
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(totalPrice * appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;

  const grandTotal = Math.max(0, totalPrice + deliveryShipping - discount);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponLoading(true);
    try {
      const code = couponInput.trim().toUpperCase();
      // Primero buscar en Firestore
      let found = null;
      try {
        const snap = await getDocs(collection(db, 'coupons'));
        const all = snap.docs.map(d => ({ ...d.data(), code: d.id }));
        found = all.find(c => c.code === code && c.active !== false);
      } catch {
        // Si Firestore falla, usar cupones locales
        found = COUPONS[code] ? { ...COUPONS[code], code } : null;
      }
      if (found) {
        setAppliedCoupon(found);
        toast.success(`✅ Cupón "${code}" aplicado — ${found.label}`);
        setCouponInput('');
      } else {
        setCouponError('Cupón inválido o expirado');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    toast.info('Cupón removido');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    console.log('Nuevo pedido:', {
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      customer_address: deliveryMethod === 'delivery' ? form.address : 'Recogida en local',
      items: items.map(i => ({ name: i.name, size: i.size, quantity: i.quantity, price: i.price })),
      subtotal: totalPrice,
      discount,
      coupon: appliedCoupon?.code || null,
      total: grandTotal,
      notes: form.notes,
      delivery_method: deliveryMethod,
      status: 'pending',
    });

    await Promise.all(items.map(i => deductStock(i.id, i.quantity)));

    clearCart();
    setOrderPlaced(true);
    toast.success('¡Pedido realizado con éxito!');
    setIsSubmitting(false);
    window.dispatchEvent(new Event('stock-updated'));
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-600/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Tu pizza está en camino. Recibirás una confirmación pronto. ¡Gracias por confiar en FORNO!
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12">
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-2xl font-display text-foreground mb-4">Tu carrito está vacío</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/menu"><ArrowLeft className="w-4 h-4 mr-2" /> Ir al menú</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/menu" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Seguir comprando
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-8">Finalizar Pedido</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Method */}
              <div>
                <Label className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3 block">
                  Método de entrega
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${deliveryMethod === 'delivery' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/30'}`}>
                    <Truck className={`w-5 h-5 ${deliveryMethod === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <span className="block text-sm font-medium text-foreground">Envío a domicilio</span>
                      <span className="block text-xs text-muted-foreground">30 min aprox.</span>
                    </div>
                  </button>
                  <button type="button" onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/30'}`}>
                    <Store className={`w-5 h-5 ${deliveryMethod === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <span className="block text-sm font-medium text-foreground">Recoger en local</span>
                      <span className="block text-xs text-muted-foreground">15 min aprox.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                    <User className="w-3.5 h-3.5 text-muted-foreground" /> Nombre
                  </Label>
                  <Input id="name" required placeholder="Tu nombre" value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="h-12 bg-secondary border-border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Teléfono
                  </Label>
                  <Input id="phone" required placeholder="+54 11 0000-0000" value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    className="h-12 bg-secondary border-border rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email
                </Label>
                <Input id="email" type="email" placeholder="tu@email.com" value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="h-12 bg-secondary border-border rounded-xl" />
              </div>

              {deliveryMethod === 'delivery' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Dirección de entrega
                  </Label>
                  <Input id="address" required={deliveryMethod === 'delivery'} placeholder="Calle, número, piso..."
                    value={form.address} onChange={e => handleChange('address', e.target.value)}
                    className="h-12 bg-secondary border-border rounded-xl" />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /> Notas (opcional)
                </Label>
                <Textarea id="notes" placeholder="Instrucciones especiales, alergias..." value={form.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  className="bg-secondary border-border rounded-xl min-h-[80px]" />
              </div>

              {/* ─── CUPÓN DE DESCUENTO ─────────────────────────────────── */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" /> Cupón de descuento
                </Label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-500">{appliedCoupon.code}</p>
                        <p className="text-xs text-muted-foreground">{appliedCoupon.label}</p>
                      </div>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon}
                      className="p-1 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ingresá tu código (ej: FORNO10)"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                      className="h-12 bg-secondary border-border rounded-xl uppercase"
                    />
                    <Button type="button" variant="outline" onClick={handleApplyCoupon}
                      disabled={!couponInput.trim() || couponLoading}
                      className="h-12 px-4 rounded-xl shrink-0">
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <X className="w-3 h-3" /> {couponError}
                  </p>
                )}
              </div>
              {/* ────────────────────────────────────────────────────────── */}

              <Button type="submit" disabled={isSubmitting}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  `Confirmar Pedido — $${grandTotal.toLocaleString('es-AR')}`
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-5">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.key} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.size} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-foreground">
                    {deliveryMethod === 'pickup' ? 'Gratis' : deliveryShipping === 0 ? 'Gratis' : `$${deliveryShipping.toLocaleString('es-AR')}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-500 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Descuento ({appliedCoupon.code})
                    </span>
                    <span className="text-emerald-500 font-medium">− ${discount.toLocaleString('es-AR')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-foreground font-bold">Total</span>
                  <span className="text-primary font-bold text-lg">${grandTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
