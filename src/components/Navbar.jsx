import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Flame, Menu, X, User, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/menu', label: 'Menú' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  { to: '/admin', label: 'Admin', adminOnly: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-transform group-hover:scale-110" />
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              FORNO
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-primary ${
                  location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-3">
            {/* Auth */}
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="w-4 h-4" />
                {user?.full_name || user?.email || 'Mi cuenta'}
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="w-4 h-4" />
                Iniciar sesión
              </Link>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-secondary hover:bg-primary/20 transition-all group"
            >
              <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2.5 rounded-full bg-secondary hover:bg-primary/20 transition-all"
            >
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenu(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium tracking-widest uppercase transition-colors ${
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border/50 mt-2 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium tracking-widest uppercase text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium tracking-widest uppercase text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Iniciar sesión
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}