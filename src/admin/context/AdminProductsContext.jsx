// src/admin/context/AdminProductsContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const AdminProductsContext = createContext();

export function AdminProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    // استمع realtime للتغييرات في مجموعة products
    setLoading(true);
    const q = query(collection(db, 'products')); // لو حبيتي orderBy('name') اضيفيها
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(items);
        setLoading(false);
      },
      (err) => {
        console.error('onSnapshot error:', err);
        showToast('فشل تحميل المنتجات', 'error');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const showToast = (message, type = 'success', ttl = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), ttl);
  };

  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, 'products'), product);
      showToast('تمت إضافة المنتج بنجاح', 'success');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء الإضافة', 'error');
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const ref = doc(db, 'products', id);
      await updateDoc(ref, updatedData);
      showToast('تم تحديث المنتج', 'success');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء التعديل', 'error');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const ref = doc(db, 'products', id);
      await deleteDoc(ref);
      showToast('تم حذف المنتج', 'success');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء الحذف', 'error');
      throw err;
    }
  };

  return (
    <AdminProductsContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        showToast,
        toast,
      }}
    >
      {children}
    </AdminProductsContext.Provider>
  );
}

export const useAdminProducts = () => useContext(AdminProductsContext);
