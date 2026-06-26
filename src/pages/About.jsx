import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, Wheat, ThermometerSun, MapPin, Phone, Mail, Clock3, Send, CheckCircle2, Star, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Social icons as SVGs (not in lucide)
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
);
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const testimonials = [
  { name: 'María G.', rating: 5, text: 'La mejor pizza de Buenos Aires sin duda. La masa es increíble, fina y crujiente como en Nápoles. ¡Repito cada semana!', avatar: 'MG' },
  { name: 'Carlos R.', rating: 5, text: 'El horno de leña marca la diferencia. Se nota el cuidado en cada ingrediente. La Diavola es espectacular.', avatar: 'CR' },
  { name: 'Laura M.', rating: 5, text: 'Ambiente acogedor, servicio excelente y pizzas de otro nivel. FORNO es ya nuestro sitio favorito en familia.', avatar: 'LM' },
];
import { processImage, heroImage } from '@/lib/pizzaData';

const values = [
  {
    icon: Wheat,
    title: 'Harina Seleccionada',
    desc: 'Utilizamos exclusivamente harina Caputo tipo 00, importada directamente de Nápoles.'
  },
  {
    icon: Clock,
    title: 'Fermentación Lenta',
    desc: '72 horas de fermentación en frío para desarrollar sabores complejos y una textura aireada.'
  },
  {
    icon: ThermometerSun,
    title: 'Horno de Leña',
    desc: 'Nuestro horno alcanza los 450°C, cocinando cada pizza en 90 segundos para el char perfecto.'
  },
  {
    icon: Flame,
    title: 'Ingredientes Nobles',
    desc: 'Tomate San Marzano DOP, mozzarella di bufala, albahaca fresca del Mediterráneo.'
  },
];

export default function About() {
  const [formSent, setFormSent] = useState(false);
  const [subSent, setSubSent] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [notifStatus, setNotifStatus] = useState('idle'); // idle | granted | denied

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();
    setSubSent(true);
  };

  const handleNotifications = () => {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(permission => {
      setNotifStatus(permission === 'granted' ? 'granted' : 'denied');
      if (permission === 'granted') {
        new Notification('🍕 FORNO', { body: '¡Notificaciones activadas! Te avisaremos de ofertas exclusivas.' });
      }
    });
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Nuestra Historia
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Donde el Fuego se convierte en Arte
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              FORNO nació de una obsesión: crear la pizza perfecta. Inspirados por las 
              tradiciones de Nápoles y el alma de nuestra ciudad, cada pizza es un 
              homenaje al oficio del pizzaiolo.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Desde 2018, hemos perfeccionado nuestra masa, seleccionado los mejores 
              ingredientes italianos y construido un horno de leña que es el corazón de 
              nuestro restaurante. No hacemos pizza rápida — hacemos pizza con alma.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src={processImage}
                alt="Proceso artesanal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-6 py-4 rounded-2xl">
              <p className="font-display text-3xl font-bold">2018</p>
              <p className="text-xs tracking-wider uppercase opacity-80">Desde</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
              Nuestros Pilares
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              La Alquimia de FORNO
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Encuéntranos
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Contacto
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MapPin,
              title: 'Dirección',
              lines: ['Armenia 1245', 'Palermo, Buenos Aires'],
            },
            {
              icon: Phone,
              title: 'Teléfono',
              lines: ['+54 11 5850-0414'],
            },
            {
              icon: Mail,
              title: 'Email',
              lines: ['hola@fornopizzeria.com.ar'],
            },
            {
              icon: Clock3,
              title: 'Horarios',
              lines: ['Lun – Jue: 12:00 – 23:00', 'Vie – Dom: 12:00 – 00:00'],
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
              {item.lines.map((line, j) => (
                <p key={j} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-3xl overflow-hidden border border-border/50 h-64 bg-card flex items-center justify-center relative"
        >
          <iframe
            title="Ubicación FORNO"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.9!2d-58.43369!3d-34.58891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5795f19fd63%3A0x5f3b4ca7a9498a0a!2sArmenia%201245%2C%20C1414%20CABA!5e0!3m2!1ses-419!2sar!4v1782171000000!5m2!1ses-419!2sar"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen=""
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-3xl p-8"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Envíanos un mensaje</h3>
            {formSent ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <p className="text-foreground font-semibold text-lg">¡Mensaje enviado!</p>
                <p className="text-muted-foreground text-sm">Te responderemos en menos de 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-background border-border"
                />
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-background border-border"
                />
                <Textarea
                  placeholder="¿En qué podemos ayudarte?"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-background border-border resize-none"
                />
                <Button type="submit" className="w-full rounded-full flex items-center gap-2">
                  <Send className="w-4 h-4" /> Enviar Mensaje
                </Button>
              </form>
            )}
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary/10 border border-primary/20 rounded-3xl p-8 flex flex-col justify-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">Únete al Club FORNO</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Recibe ofertas exclusivas, novedades del menú y noticias de nuestro horno directamente en tu bandeja de entrada.
            </p>
            {subSent ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-sm text-foreground font-medium">¡Ya formas parte del Club FORNO!</p>
              </div>
            ) : (
              <form onSubmit={handleSubSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={subEmail}
                  onChange={e => setSubEmail(e.target.value)}
                  required
                  className="bg-background border-border flex-1"
                />
                <Button type="submit" className="rounded-full px-5 shrink-0">
                  Suscribirme
                </Button>
              </form>
            )}
            <p className="text-xs text-muted-foreground mt-4">Sin spam. Puedes darte de baja cuando quieras.</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">Lo que dicen</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Testimonios</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media + Notifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-3xl p-8"
          >
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">Síguenos</p>
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Redes Sociales</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Instagram', handle: '@fornopizzeria', Icon: InstagramIcon, href: 'https://instagram.com', color: 'hover:border-pink-500/40 hover:text-pink-400' },
                { label: 'Facebook', handle: 'FORNO Pizzería', Icon: FacebookIcon, href: 'https://facebook.com', color: 'hover:border-blue-500/40 hover:text-blue-400' },
                { label: 'TikTok', handle: '@forno.pizza', Icon: TikTokIcon, href: 'https://tiktok.com', color: 'hover:border-foreground/40 hover:text-foreground' },
              ].map(({ label, handle, Icon, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-2xl border border-border/50 transition-all group ${color}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary/10 border border-primary/20 rounded-3xl p-8 flex flex-col justify-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Bell className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">Activa las Notificaciones</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Sé el primero en enterarte de nuestras ofertas del día, nuevas pizzas de temporada y promociones exclusivas.
            </p>
            <AnimatePresence mode="wait">
              {notifStatus === 'granted' ? (
                <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-sm text-foreground font-medium">¡Notificaciones activadas!</p>
                </motion.div>
              ) : notifStatus === 'denied' ? (
                <motion.div key="denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl">
                  <BellOff className="w-5 h-5 text-destructive shrink-0" />
                  <p className="text-sm text-foreground font-medium">Permiso denegado en el navegador.</p>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Button onClick={handleNotifications} className="rounded-full flex items-center gap-2 w-full sm:w-auto">
                    <Bell className="w-4 h-4" /> Activar Notificaciones
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="FORNO" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/85" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              ¿Listo para probar?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Descubre por qué somos la pizzería favorita de la ciudad.
            </p>
            <a
              href="/menu"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              <Flame className="w-5 h-5" />
              Pedir Ahora
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}