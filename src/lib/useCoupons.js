import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/api/firebaseClient';

const DEFAULT_COUPONS = [
  { code: 'FORNO10',    type: 'percent', value: 10,   active: true,  label: '10% de descuento' },
  { code: 'FORNO20',    type: 'percent', value: 20,   active: true,  label: '20% de descuento' },
  { code: 'PIZZA500',   type: 'fixed',   value: 500,  active: true,  label: '$500 de descuento' },
  { code: 'BIENVENIDO', type: 'percent', value: 15,   active: true,  label: '15% — Bienvenida' },
];

export function useCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const snap = await getDocs(collection(db, 'coupons'));
      if (snap.empty) {
        // Seed cupones por defecto
        for (const c of DEFAULT_COUPONS) {
          await setDoc(doc(db, 'coupons', c.code), c);
        }
        setCoupons(DEFAULT_COUPONS);
      } else {
        setCoupons(snap.docs.map(d => ({ ...d.data(), code: d.id })));
      }
    } catch (e) {
      console.warn('Error cargando cupones:', e);
      setCoupons(DEFAULT_COUPONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const addCoupon = async (data) => {
    const code = data.code.toUpperCase().trim();
    await setDoc(doc(db, 'coupons', code), { ...data, code });
    await fetchCoupons();
  };

  const toggleCoupon = async (code, active) => {
    await updateDoc(doc(db, 'coupons', code), { active });
    await fetchCoupons();
  };

  const deleteCoupon = async (code) => {
    await deleteDoc(doc(db, 'coupons', code));
    await fetchCoupons();
  };

  return { coupons, loading, addCoupon, toggleCoupon, deleteCoupon, refetch: fetchCoupons };
}
