import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { pizzas } from '@/lib/pizzaData';

const galleryItems = pizzas.map(p => ({
  id: p.id,
  name: p.name,
  subtitle: p.subtitle,
  image: p.image,
}));

export default function PizzaGallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="py-20 sm:py-28 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12"
        >
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Galería
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
              Pura Tentación Visual
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-primary text-sm font-medium flex items-center gap-1 mt-4 sm:mt-0 hover:gap-2 transition-all"
          >
            Ver el menú completo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                i === 0 || i === 5 ? 'row-span-2' : ''
              }`}
              style={{ aspectRatio: i === 0 || i === 5 ? '3/4' : '1/1' }}
              onClick={() => setLightbox(item)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-0.5">
                  {item.subtitle}
                </p>
                <p className="text-sm font-bold text-foreground">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.image}
                alt={lightbox.name}
                className="w-full object-cover max-h-[75vh]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/70 to-transparent">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-1">
                  {lightbox.subtitle}
                </p>
                <h3 className="font-display text-2xl font-bold text-foreground">{lightbox.name}</h3>
                <Link
                  to={`/pizza/${lightbox.id}`}
                  onClick={() => setLightbox(null)}
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:gap-2.5 transition-all"
                >
                  Ver detalles y pedir <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}