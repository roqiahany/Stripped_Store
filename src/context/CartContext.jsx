import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [promo, setPromo] = useState({
    code: null,
    discount: 0,
  });

  const applyPromoCode = (code) => {
    const promoCodes = {
      SAVE10: 10,
      SAVE20: 20,
      VIP30: 30,
    };

    const discount = promoCodes[code];
    if (!discount) return false;

    const updatedCart = cart.map((item) => ({
      ...item,
      finalPrice: item.price * (1 - discount / 100),
    }));

    setCart(updatedCart);
    setPromo({ code, discount });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    syncCartToFirestore(updatedCart);

    return true;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const cartRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(cartRef);

        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        let mergedCart = [...localCart];

        if (docSnap.exists() && docSnap.data().cart) {
          const firestoreCart = docSnap.data().cart;

          // 🔄 دمج السلتين
          firestoreCart.forEach((item) => {
            const existingItem = mergedCart.find((i) => i.id === item.id);
            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              mergedCart.push(item);
            }
          });
        }

        const calculatedTotal = mergedCart.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        );
        await updateDoc(cartRef, {
          cart: mergedCart,
          total: calculatedTotal,
        });

        console.log('TOTAL IS: ', calculatedTotal);

        // حفظ السلة
        setCart(mergedCart);
        localStorage.setItem('cart', JSON.stringify(mergedCart));

        // حفظ total كمان داخل Firestore (اختياري)
        await updateDoc(cartRef, {
          cart: mergedCart,
          total: calculatedTotal,
        });
      } else {
        // المستخدم مش داخل
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
      }
    });

    return () => unsubscribe();
  }, []);

  const syncCartToFirestore = async (updatedCart) => {
    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(db, 'users', user.uid);
      await updateDoc(cartRef, { cart: updatedCart }).catch(async (err) => {
        // لو الكارت مش موجود في الدوك
        if (err.code === 'not-found') {
          await setDoc(cartRef, { cart: updatedCart }, { merge: true });
        } else {
          console.error(err);
        }
      });
    }
  };

  const incrementQuantity = (id, selectedSize = null) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id && item.selectedSize?.name === selectedSize?.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      syncCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  const decrementQuantity = (id, selectedSize = null) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id &&
        item.selectedSize?.name === selectedSize?.name &&
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      syncCartToFirestore(updatedCart);
      return updatedCart;
    });
  };
  const addToCart = (item, quantity = 1, selectedSize = null, discount = 0) => {
    setCart((prev) => {
      const exist = prev.find(
        (i) => i.id === item.id && i.selectedSize?.name === selectedSize?.name
      );

      const finalPrice = item.price * (1 - discount / 100);

      let updatedCart;
      if (exist) {
        updatedCart = prev.map((i) =>
          i.id === item.id && i.selectedSize?.name === selectedSize?.name
            ? { ...i, quantity: i.quantity + quantity, finalPrice }
            : i
        );
      } else {
        updatedCart = [
          ...prev,
          { ...item, quantity, selectedSize, finalPrice },
        ];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      syncCartToFirestore(updatedCart);

      return updatedCart;
    });
  };

  const removeFromCart = (id, selectedSize = null) => {
    setCart((prev) => {
      const updatedCart = prev.filter(
        (item) =>
          !(item.id === id && item.selectedSize?.name === selectedSize?.name)
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      syncCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    syncCartToFirestore([]);
  };

  const resetCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        applyPromoCode,
        promo,
        addToCart,
        removeFromCart,
        clearCart,
        resetCart,
        setCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
