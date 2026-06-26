import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/api/firebaseClient';
import { pizzas } from './pizzaData';

// Lee el stock de un producto desde Firestore
export async function getPizzaStock(pizzaId) {
  try {
    const snap = await getDoc(doc(db, 'products', pizzaId));
    return snap.exists() ? (snap.data().stock ?? 0) : 0;
  } catch {
    return pizzas.find(p => p.id === pizzaId)?.stock ?? 0;
  }
}

// Descuenta stock en Firestore al confirmar un pedido
export async function deductStock(pizzaId, quantity) {
  try {
    const ref = doc(db, 'products', pizzaId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const current = snap.data().stock ?? 0;
      const newStock = Math.max(0, current - quantity);
      await updateDoc(ref, { stock: newStock });
      return newStock;
    }
  } catch (e) {
    console.error('Error descontando stock:', e);
  }
  return 0;
}

// Devuelve todas las pizzas con stock actual desde Firestore
// (para compatibilidad con Menu.jsx que llama a getPizzasWithStock)
export async function getPizzasWithStock() {
  // Esta función ya no se usa directo — useProducts() la reemplaza
  return pizzas;
}
