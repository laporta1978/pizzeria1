import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/api/firebaseClient';
import { pizzas as localPizzas } from '@/lib/pizzaData';

const withTimeout = (promise, ms = 5000) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
]);

async function seedIfEmpty() {
  const snap = await withTimeout(getDocs(collection(db, 'products')));
  if (snap.empty) {
    await Promise.all(localPizzas.map(p => setDoc(doc(db, 'products', p.id), p)));
  }
}

export function useProducts() {
  // Arranca INMEDIATAMENTE con datos locales — sin pantalla blanca
  const [products, setProducts] = useState(localPizzas);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      await seedIfEmpty();
      const snap = await withTimeout(getDocs(collection(db, 'products')));
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    } catch (e) {
      console.warn('Firestore no disponible, usando datos locales:', e.message);
      // Ya tiene los datos locales, no hace falta hacer nada
    }
  };

  useEffect(() => {
    // Carga Firestore en segundo plano sin bloquear la UI
    fetchProducts();
  }, []);

  const updateProduct = async (id, data) => {
    await updateDoc(doc(db, 'products', id), data);
    await fetchProducts();
  };

  const addProduct = async (data) => {
    setLoading(true);
    const ref = await addDoc(collection(db, 'products'), data);
    await fetchProducts();
    setLoading(false);
    return ref.id;
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    await deleteDoc(doc(db, 'products', id));
    await fetchProducts();
    setLoading(false);
  };

  return { products, loading, updateProduct, addProduct, deleteProduct, refetch: fetchProducts };
}
