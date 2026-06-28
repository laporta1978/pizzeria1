import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNoRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';
import { CartProvider } from '@/lib/cartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminLogin from '@/pages/AdminLogin';
import AppLayout from '@/components/AppLayout';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import PizzaDetail from '@/pages/PizzaDetail';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Admin from '@/pages/Admin';

const ADMIN_EMAIL = "admin@talentotech.com";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, user, isAuthenticated } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  const isAdmin = isAuthenticated && user?.email === ADMIN_EMAIL;

  return (
    <CartProvider>
      <Routes>
        {/* Login clientes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Login admin separado */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Rutas públicas del sitio */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/pizza/:id" element={<PizzaDetail />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />

          {/* Checkout: requiere login de cliente */}
          <Route
            path="/checkout"
            element={
              isAuthenticated
                ? <Checkout />
                : <Navigate to="/login" replace />
            }
          />

          {/* Admin: requiere ser el admin */}
          <Route
            path="/admin"
            element={
              isAdmin
                ? <Admin />
                : <Navigate to="/admin-login" replace />
            }
          />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </CartProvider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App