import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import ProductTable from '../components/ProductTable';

import { AdminProductsProvider } from '../context/AdminProductsContext';
import ProductForm from './../components/ProductForm/ProductForm';

export function AdminDashboardInner() {
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <AdminSidebar>
      <div className="flex flex-col lg:flex-row gap-6 md:px-8 py-6 w-full max-w-7xl mx-auto">
        {/* فورم المنتج */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md p-5 border border-gray-100 overflow-hidden">
          <ProductForm
            editingProduct={editingProduct}
            clearEditing={() => setEditingProduct(null)}
          />
        </div>

        {/* جدول المنتجات */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-md p-5 border border-gray-100 overflow-x-auto">
          <ProductTable onEdit={(p) => setEditingProduct(p)} />
        </div>
      </div>
    </AdminSidebar>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProductsProvider>
      <AdminDashboardInner />
    </AdminProductsProvider>
  );
}
