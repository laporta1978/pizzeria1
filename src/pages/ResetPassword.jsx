import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

// Firebase maneja el reset de contraseña via su propio link/email
// Esta página solo informa al usuario
export default function ResetPassword() {
  return (
    <AuthLayout
      icon={Lock}
      title="Revisá tu email"
      subtitle="Seguí el link que te enviamos para restablecer tu contraseña"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Volver al inicio de sesión
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground text-center">
        Firebase te enviará un email con un link seguro para crear una nueva contraseña.
      </p>
    </AuthLayout>
  );
}
