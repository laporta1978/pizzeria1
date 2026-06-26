# FORNO – Pizzería (React + Vite)

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí http://localhost:5173

Para generar la build de producción:

```bash
npm run build
npm run preview
```

## ⚠️ Sobre el login / registro (Base44)

Las páginas `Login`, `Register`, `ForgotPassword` y `ResetPassword` usan el SDK
`@base44/sdk`, que se conecta a un backend de Base44 (`appParams.appId` en
`src/lib/app-params.jsx`). Sin un proyecto de Base44 configurado, esas
pantallas se van a renderizar bien, pero las llamadas a `base44.auth.*` van a
fallar (quedan controladas con try/catch, no rompen la app).

Si no vas a usar Base44, podés:
- Dejarlas como están (no afectan Inicio/Menú/Carrito/Checkout).
- O reemplazar `src/api/base44Client.jsx` por tu propio backend de auth.

`ResetPassword.jsx` llama a `base44.auth.resetPassword({ token, password })`.
Revisá el nombre exacto del método en la versión del SDK que uses
(`node_modules/@base44/sdk`), puede variar entre versiones.

## Qué se reconstruyó / corrigió

El `.rar` original traía solo una parte de `src/` (sin `package.json`,
`vite.config.js`, `index.html`, `App.jsx`, `main.jsx`, Tailwind, etc.) y 14
archivos llegaron vacíos por estar dañado. Esto es lo que se hizo:

### Archivos de configuración (nuevos)
- `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
- `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

### Carrito (el pedido principal)
- `src/lib/cartContext.jsx` — **no existía**. Contiene todo el estado del
  carrito (`addItem`, `removeItem`, `updateQuantity`, `clearCart`,
  `totalItems`, `totalPrice`, `isOpen`/`setIsOpen`) con persistencia en
  `localStorage`.
- `src/components/CartDrawer.jsx` — llegó vacío, reconstruido como panel
  lateral (Sheet) con lista de productos, control de cantidad y total.
- `src/pages/Checkout.jsx` — llegó vacío (`Chechout.jsx`), reconstruido como
  página de confirmación de pedido con formulario de entrega y resumen.

### Layout y rutas
- `src/components/AppLayout.jsx`, `src/components/ScrollToTop.jsx`,
  `src/components/ProtectedRoute.jsx` — vacíos, reconstruidos.
- `src/pages/ResetPassword.jsx` — vacío, reconstruido siguiendo el patrón de
  `ForgotPassword.jsx`.
- `src/App.jsx` — define todas las rutas (`/`, `/menu`, `/pizza/:id`,
  `/nosotros`, `/checkout`, `/login`, `/register`, `/forgot-password`,
  `/reset-password`, 404).

### Renombres para que coincidan los imports
Todo el código importaba rutas en inglés/mayúsculas que no coincidían con los
archivos reales (esto rompía el build en Linux/Vercel/Netlify, sensibles a
mayúsculas):

| Se importaba | Archivo real (antes) | Ahora |
|---|---|---|
| `@/components/*` | `src/componentes/*` | `src/components/*` |
| `@/lib/pizzaData` | `src/lib/PizzaData.js` | `src/lib/pizzaData.js` |
| `@/api/base44Client` | `src/api/base44clients.jsx` | `src/api/base44Client.jsx` |
| `@/components/GoogleIcon` | `src/componentes/Googlecon.jsx` | `src/components/GoogleIcon.jsx` |

### Componentes de ui/ (shadcn) reconstruidos
Llegaron vacíos o con contenido incorrecto y se rehicieron con la
implementación estándar de shadcn/ui: `input.jsx`, `textarea.jsx`,
`progress.jsx`, `separator.jsx`, `avatar.jsx`, `toast.jsx`, `toaster.jsx`,
`sonner.jsx` (tenía el código de `slider.jsx` pegado por error), `form.jsx`,
`calendar.jsx`, `resizable.jsx`, `sidebar.jsx`, `chart.jsx`, y se agregó
`input-otp.jsx` (usado por `Register.jsx` y no existía).

También se corrigieron nombres de archivo con errores de tipeo:
`accodion.jsx` → `accordion.jsx`, `contex-menu.jsx` → `context-menu.jsx`,
`natigation-menu.jsx` → `navigation-menu.jsx`.

## Estilo / tema
Se agregó un tema oscuro tipo "horno de leña" (naranja/fuego como color
primario) en `src/index.css`, ya que el código usaba clases como
`bg-primary`, `text-foreground`, `font-display`, etc. sin que existiera
ninguna definición de esas variables. La tipografía de títulos es "Fraunces"
(Google Fonts, ya enlazada en `index.html`).
