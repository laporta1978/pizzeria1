import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock3, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Ponte en contacto
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            ¿Tienes una pregunta?
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nos encantaría escucharte. Contacta con nosotros y te responderemos
            en el menor tiempo posible.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
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
              lines: ['+54 1158500414'],
            },
            {
              icon: Mail,
              title: 'Email',
              lines: ['hola@forno.es'],
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
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-border/50 h-80 bg-card flex items-center justify-center relative"
        >
          <iframe
            title="Ubicación FORNO pizzeria"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.9!2d-58.43369!3d-34.58891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5795f19fd63%3A0x5f3b4ca7a9498a0a!2sArmenia%201245%2C%20C1414%20CABA!5e0!3m2!1ses-419!2sar!4v1782171000000!5m2!1ses-419!2sar "
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen=""
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border/50 rounded-3xl p-8 sm:p-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Envíanos un mensaje
            </h2>
          </div>

          {formSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4 text-center"
            >
              <CheckCircle2 className="w-14 h-14 text-emerald-400" />
              <p className="text-foreground font-semibold text-lg">¡Mensaje enviado exitosamente!</p>
              <p className="text-muted-foreground">Te responderemos en menos de 24 horas.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              </div>
              <Input
                type="tel"
                placeholder="Tu teléfono (opcional)"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="bg-background border-border"
              />
              <Textarea
                placeholder="¿En qué podemos ayudarte? Cuéntanos detalles sobre tu consulta..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                rows={6}
                className="bg-background border-border resize-none"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto rounded-full flex items-center gap-2 px-8 py-3 text-base font-semibold"
              >
                <Send className="w-4 h-4" /> Enviar Mensaje
              </Button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Response Time Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 text-center"
        >
          <p className="text-foreground text-sm sm:text-base">
            <span className="font-semibold">Tiempo de respuesta:</span> Respondemos todos los mensajes en menos de 24 horas
            durante días hábiles. Si tienes una urgencia, llama al <a href="tel:+34912345678" className="text-primary hover:underline font-semibold">+54 1158500414</a>.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
