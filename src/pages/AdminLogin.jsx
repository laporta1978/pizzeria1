import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/api/firebaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Flame, Lock, Mail, Loader2, ShieldCheck } from "lucide-react";

const ADMIN_EMAIL = "admin@talentotech.com"; // tu email de admin

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email !== ADMIN_EMAIL) {
        await auth.signOut();
        setError("No tenés permisos de administrador");
        setLoading(false);
        return;
      }
      navigate("/admin");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-8 h-8 text-primary" />
              <span className="font-display text-2xl font-bold">FORNO</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">Panel Administrador</h1>
            </div>
            <p className="text-sm text-muted-foreground">Acceso restringido al equipo FORNO</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoFocus
                  placeholder="admin@forno.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verificando...</>
              ) : (
                <><ShieldCheck className="w-4 h-4 mr-2" />Ingresar al panel</>
              )}
            </Button>
          </form>

          <div className="text-center">
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Volver a la pizzería
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
