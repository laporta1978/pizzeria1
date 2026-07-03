# 🍕 FORNO — Pizzería Online

Aplicación web full-stack para una pizzería artesanal: catálogo de productos, carrito de compras, autenticación de clientes y panel de administración con gestión de stock en tiempo real.

Construido con **React + Vite** y **Firebase** (Auth + Firestore), desplegado en **Vercel**.

---

## 📋 Tabla de contenidos

- [Demo](#-demo)
- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Requisitos previos](#-requisitos-previos)
- [Instalación local](#-instalación-local)
- [Configuración de Firebase](#-configuración-de-firebase)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Roles de usuario](#-roles-de-usuario)
- [Despliegue en Vercel](#-despliegue-en-vercel)
- [Autor](#-autor)




---

## 🛠 Tecnologías

| Categoría        | Stack                                      |
|-------------------|--------------------------------------------|
| Frontend          | React 18, Vite                              |
| Estilos           | Tailwind CSS, shadcn/ui, Framer Motion      |
| Backend / Datos   | Firebase Authentication, Cloud Firestore    |
| Ruteo             | React Router DOM                            |
| Estado / Data     | TanStack React Query, Context API           |
| Formularios       | React Hook Form                             |
| Iconos            | Lucide React                                |
| Hosting           | Vercel                                      |

---

## ✨ Características

- 🍕 Catálogo de pizzas con categorías, ingredientes, tamaños y precios
- 🛒 Carrito de compras persistente con checkout
- 🔐 Autenticación de clientes (email/contraseña + Google)
- 🔑 Panel de administración con login separado (solo staff)
- 📦 Gestión de stock en tiempo real desde Firestore
- ➕ Alta, edición y baja de productos desde el panel admin
- ⚠️ Alertas automáticas de productos sin stock
- 📍 Página de contacto con mapa embebido
- 📱 Diseño responsive, tema oscuro con acentos cálidos
- 💳 Sección de medios de pago y envío en el footer

---



### 1. Cloná el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```

### 2. Instalá las dependencias

```bash
npm install
```


### 3. Iniciá el servidor de desarrollo

```bash
npm run dev
```

La aplicación va a estar disponible en:

```
http://localhost:5173
```

---

## 🔥 Configuración de Firebase

Este proyecto necesita un proyecto de Firebase activo con **Authentication** y **Firestore** habilitados.

### Paso 1 — Crear el proyecto

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com/)
2. Click en **"Agregar proyecto"** y seguí los pasos
3. Una vez creado, andá a **Configuración del proyecto → General** y registrá una app web (ícono `</>`)
4. Copiá el objeto `firebaseConfig` que te genera (lo vas a necesitar para el `.env`)

### Paso 2 — Habilitar Authentication

1. En el menú lateral, click en **Authentication → Sign-in method**
2. Habilitá los proveedores:
   - **Correo electrónico/contraseña**
   - **Google**

### Paso 3 — Crear la base de datos Firestore

1. En el menú lateral, click en **Firestore Database**
2. Click en **"Crear base de datos"**
3. Elegí **Edición Standard**
4. Seleccioná la región más cercana (ej. `southamerica-east1` para Argentina)
5. Elegí **"Comenzar en modo de prueba"**

### Paso 4 — Configurar las reglas de seguridad

En la pestaña **Reglas** de Firestore, pegá:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```


## 🔐 Variables de entorno

Creá un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```



---

## 📜 Scripts disponibles

| Comando             | Descripción                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Inicia el servidor de desarrollo en `localhost:5173` |
| `npm run build`      | Genera la build de producción en `/dist`         |
| `npm run preview`    | Sirve localmente la build de producción          |

Para probar la build de producción en tu máquina:

```bash
npm run build
npm run preview
```

---

## 📁 Estructura del proyecto

```
pizzeria1/
├── public/                  # Archivos estáticos
├── src/
│   ├── api/                 # Configuración de Firebase
│   │   └── firebaseClient.jsx
│   ├── components/          # Componentes reutilizables (Navbar, Footer, UI, etc.)
│   ├── lib/                 # Contextos, hooks y utilidades
│   │   ├── AuthContext.jsx  # Manejo de autenticación
│   │   ├── cartContext.jsx  # Manejo del carrito de compras
│   │   ├── useProducts.js   # Hook de productos/stock con Firestore
│   │   ├── stockManager.js  # Lógica de descuento de stock
│   │   └── pizzaData.js     # Datos semilla de productos
│   ├── pages/                # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── PizzaDetail.jsx
│   │   ├── Checkout.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx / Register.jsx
│   │   ├── AdminLogin.jsx   # Login exclusivo del panel admin
│   │   └── Admin.jsx        # Panel de gestión de productos y stock
│   ├── App.jsx               # Definición de rutas
│   └── main.jsx               # Punto de entrada
├── .env                      # Variables de entorno (no se sube a git)
├── vercel.json                # Configuración de rutas para Vercel
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---






## 👨‍💻 Autor

**Gastón Damián**
Proyecto desarrollado en el marco del programa **Talento Tech**.

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

pagina web
usuario: gastontalento@gmail.com
contraseña: 12345678

admin
usuario:admin@talentotech.com
contraseñas:123456

---
