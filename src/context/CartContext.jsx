import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // تحميل الكارت من Firestore عند تسجيل الدخول
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const cartRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(cartRef);

        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        let mergedCart = [...localCart];

        if (docSnap.exists() && docSnap.data().cart) {
          const firestoreCart = docSnap.data().cart;

          // 🔄 دمج السلتين مع تجميع الكميات لنفس المنتج
          firestoreCart.forEach((item) => {
            const existingItem = mergedCart.find((i) => i.id === item.id);
            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              mergedCart.push(item);
            }
          });
        }

        // ✅ حفظ السلة المدمجة في Firestore وlocalStorage
        setCart(mergedCart);
        localStorage.setItem('cart', JSON.stringify(mergedCart));
        await updateDoc(cartRef, { cart: mergedCart });
      } else {
        // المستخدم مش داخل → نحمل السلة من localStorage فقط
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
  const addToCart = (item, quantity = 1, selectedSize = null) => {
    setCart((prev) => {
      // نشوف هل موجود نفس المنتج بنفس الحجم
      const exist = prev.find(
        (i) => i.id === item.id && i.selectedSize?.name === selectedSize?.name
      );

      let updatedCart;
      if (exist) {
        updatedCart = prev.map((i) =>
          i.id === item.id && i.selectedSize?.name === selectedSize?.name
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        updatedCart = [...prev, { ...item, quantity, selectedSize }];
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
        addToCart,
        removeFromCart,
        clearCart,
        resetCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
