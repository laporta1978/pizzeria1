import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  { name: 'María G.', location: 'Madrid', rating: 5, text: 'La mejor pizza de Madrid sin duda. La masa es increíble, fina y crujiente como en Nápoles. ¡Repito cada semana sin falta!' },
  { name: 'Carlos R.', location: 'Madrid', rating: 5, text: 'El horno de leña marca la diferencia. Se nota el cuidado en cada ingrediente. La Diavola es absolutamente espectacular.' },
  { name: 'Laura M.', location: 'Getafe', rating: 5, text: 'Ambiente acogedor, servicio excelente y pizzas de otro nivel. FORNO es ya nuestro sitio favorito en familia para cada ocasión.' },
  { name: 'Andrés T.', location: 'Alcalá', rating: 5, text: 'La Tartufo con trufa negra es una experiencia que no olvidarás. Ingredientes de primera calidad en cada bocado. ¡Impresionante!' },
  { name: 'Sofía V.', location: 'Madrid', rating: 5, text: 'Pedí a domicilio y llegó perfecta, caliente y crujiente. La Quattro Formaggi es un sueño. Servicio rapidísimo y trato inmejorable.' },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => { setDirection(-1); setCurrent(i => (i - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setDirection(1); setCurrent(i => (i + 1) % testimonials.length); };

  useEffect(() => {
    const timer = setTimeout(next, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  const t = testimonials[current];

  return (
    <section className="py-20 sm:py-28 border-t border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">Opiniones</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Lo Que Dicen Nuestros Clientes</h2>
        </motion.div>

        {/* Cards row */}
        <div className="hidden sm:grid grid-cols-3 gap-6 mb-10">
          {[-1, 0, 1].map(offset => {
            const idx = (current + offset + testimonials.length) % testimonials.length;
            const item = testimonials[idx];
            const isCenter = offset === 0;
            return (
              <motion.div
                key={idx}
                layout
                animate={{ scale: isCenter ? 1 : 0.93, opacity: isCenter ? 1 : 0.5 }}
                transition={{ duration: 0.4 }}
                className={`p-7 rounded-3xl border transition-colors ${
                  isCenter
                    ? 'bg-card border-primary/30 shadow-[0_0_40px_-10px_hsl(18,100%,50%,0.15)]'
                    : 'bg-card/60 border-border/40'
                }`}
              >
                <Quote className="w-7 h-7 text-primary/30 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{item.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile single card */}
        <div className="sm:hidden relative mb-10 min-h-[220px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.3 }}
              className="p-7 rounded-3xl bg-card border border-primary/30"
            >
              <Quote className="w-7 h-7 text-primary/30 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary text-muted-foreground flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-border hover:bg-muted-foreground'}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary text-muted-foreground flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}