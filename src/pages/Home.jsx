import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroImage, processImage } from '@/lib/pizzaData';
import { useProducts } from '@/lib/useProducts';
import PizzaCard from '@/components/PizzaCard';
import PizzaGallery from '@/components/PizzaGallery';
import Testimonials from '@/components/Testimonials';

const features = [
  { icon: Flame, title: 'Horno de Leña', desc: 'Cocción a 450°C para una masa perfecta' },
  { icon: Clock, title: 'Masa 72h', desc: 'Fermentación lenta de 72 horas' },
  { icon: Truck, title: 'Envío Rápido', desc: 'Entrega en menos de 30 minutos' },
];

export default function Home() {
  const { products: pizzasWithStock } = useProducts();
  const featured = pizzasWithStock.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Pizza artesanal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-primary text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-4"
            >
              Pizzería Artesanal
            </motion.p>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-[0.9] mb-6">
              <span className="block">El Arte</span>
              <span className="block">del</span>
              <span className="block text-primary">Fuego</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed mb-8">
              Cada pizza es una obra maestra horneada en nuestro horno de leña napolitano. 
              Ingredientes nobles, masa de 72 horas, fuego auténtico.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-base font-semibold group"
              >
                <Link to="/menu">
                  Pedir Ahora
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-secondary rounded-full px-8 h-14 text-base"
              >
                <Link to="/nosotros">
                  Nuestra Historia
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12"
          >
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
                Selección
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
                Nuestras Favoritas
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-primary text-sm font-medium flex items-center gap-1 mt-4 sm:mt-0 hover:gap-2 transition-all"
            >
              Ver todo el menú <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((pizza, i) => (
              <PizzaCard key={pizza.id} pizza={pizza} index={i} />
            ))}
          </div>
        </div>
      </section>

      <PizzaGallery />
      <Testimonials />

      {/* Process Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={processImage} alt="Proceso artesanal" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Nuestro Proceso
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Tradición en cada mordida
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Desde la selección de la harina hasta el último toque de albahaca, 
              cada paso es un ritual. Nuestra masa fermenta durante 72 horas 
              para lograr esa textura inigualable.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-base font-semibold"
            >
              <Link to="/menu">Descubre el Menú</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}