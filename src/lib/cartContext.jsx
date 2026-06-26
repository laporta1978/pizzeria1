import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);
const STORAGE_KEY = 'forno_cart_items';

function loadInitialItems() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('No se pudo leer el carrito guardado:', error);
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadInitialItems);
  const [isOpen, setIsOpen] = useState(false);

  // Persiste el carrito en localStorage para que sobreviva a recargas de página
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('No se pudo guardar el carrito:', error);
    }
  }, [items]);

  // Agrega una pizza al carrito. Si ya existe la misma pizza + tamaño, suma la cantidad.
  const addItem = (pizza, sizeName, quantity = 1) => {
    const size = pizza.sizes.find((s) => s.name === sizeName) || pizza.sizes[0];

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === pizza.id && item.size === size.name
      );

      if (existingIndex !== -1) {
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...prev,
        {
          id: pizza.id,
          name: pizza.name,
          image: pizza.image,
          size: size.name,
          price: size.price,
          quantity,
        },
      ];
    });
  };

  const removeItem = (id, size) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id && item.size === size ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
