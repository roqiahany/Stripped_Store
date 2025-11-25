import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar/Navbar';
import PriceFilterSidebar from './../components/PriceFilterSidebar';
import ProductCard from '../components/ProductDetails/ProductCard';

const CategoryPage = () => {
  const { categoryName } = useParams(); // اسم القسم من الرابط
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 8;

  // 📌 1. تحميل المنتجات الخاصة بالقسم
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const querySnapshot = await getDocs(collection(db, 'products'));
        const allProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoryProducts = allProducts.filter(
          (p) => p.category === categoryName
        );

        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);

        const maxVal = Math.max(...categoryProducts.map((p) => p.price || 0));
        setMaxPrice(maxVal);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false); // ✅ هنا الصح
      }
    };

    fetchProducts();
  }, [categoryName]);

  // 📌 2. تطبيق الفلتر بالسعر
  const handleFilter = () => {
    if (min === '' && max === '') {
      setFilteredProducts(products);
      return;
    }

    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || maxPrice;

    const filtered = products.filter(
      (p) => p.price >= minVal && p.price <= maxVal
    );
    setFilteredProducts(filtered);
    setShowFilter(false);
    setCurrentPage(1);
  };

  // 📌 3. حساب الباجينيشن
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const resetFilter = () => {
    setMin('');
    setMax('');
    setFilteredProducts(products);
  };
  return (
    <div className="bg-white">
      <Navbar />

      {/* 🔹 Hero Section */}
      <div className="  py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-end ">
          <h1
            className="text-5xl font-light text-gray-800 tracking-wide capitalize"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Products
          </h1>
        </div>
      </div>
      <section className="py-16 bg-white min-h-screen max-w-7xl mx-auto">
        <div
          className="bg-white px-6 flex justify-between items-center gap-6 mb-10"
          dir="ltr"
        >
          {/* الزر نفسه */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
            >
              Filter : Price
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  showFilter ? 'rotate-180' : 'rotate-0'
                }`}
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* البوب اب */}
            {showFilter && (
              <div className="absolute top-full mt-2 left-0 z-50 animate-fadeIn">
                <PriceFilterSidebar
                  min={min}
                  max={max}
                  setMin={setMin}
                  setMax={setMax}
                  products={products}
                  setFilteredProducts={setFilteredProducts}
                  maxPrice={maxPrice}
                  setCurrentPage={setCurrentPage}
                  setShowFilter={setShowFilter}
                  resetFilter={resetFilter}
                />
              </div>
            )}
          </div>

          {/* عدد المنتجات الديناميكي */}
          <div className="text-gray-700 font-medium">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 && 's'}
          </div>
        </div>
        {/* المنتجات */}
        <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* 🔥 LOADING MODE */}
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="w-full h-[400px] bg-gray-200 rounded-xl shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))
          ) : currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imageHeight="h-[400px]"
                yOffset={30}
                delay={index * 0.1}
                duration={0.5}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-12 col-span-4">
              لا توجد منتجات في هذا القسم.
            </p>
          )}
        </div>
        {/* الباجينيشن */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === i + 1
                    ? 'bg-pink-600 text-white'
                    : 'bg-white hover:bg-gray-100'
                } transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}{' '}
        {/* popup الفلتر */}
      </section>

      <div />
    </div>
  );
};

export default CategoryPage;
