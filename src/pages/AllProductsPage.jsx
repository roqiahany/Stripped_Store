import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Navbar from './../components/Navbar/Navbar';
import PriceFilterSidebar from './../components/PriceFilterSidebar';
import { motion } from 'framer-motion';
import ProductCard from './../components/ProductDetails/ProductCard';
import { X } from 'lucide-react';

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ⭐ NEW
  const [showFilter, setShowFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // ⭐ Skeleton للمنتجات
  const SkeletonProduct = () => (
    <div className="animate-pulse">
      <div className="w-full h-40 sm:h-52 md:h-64 bg-gray-300 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.3s_infinite]"></div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const allProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(allProducts);
      setFilteredProducts(allProducts);

      const maxVal = Math.max(...allProducts.map((p) => p.price || 0));
      setMaxPrice(maxVal);

      // شوية وقت بسيط عشان السكيلتون يظهر بنعومة
      setTimeout(() => setLoading(false), 600);
    };

    fetchProducts();
  }, []);

  // الفلتر
  useEffect(() => {
    if (loading) return;

    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || maxPrice;

    const filtered = products.filter(
      (p) => p.price >= minVal && p.price <= maxVal
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [min, max, products, maxPrice, loading]);

  // pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const resetFilter = () => {
    setMin('');
    setMax('');
    setFilteredProducts(products);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="py-4 sm:py-6 md:py-8 lg:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-end">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 tracking-wide capitalize">
            Products
          </h1>
        </div>
      </div>

      <section
        className="py-4 sm:py-12 md:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8"
        dir="ltr"
      >
        {/* Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="relative inline-block">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="
    flex items-center gap-2
    bg-pink-600 hover:bg-pink-700 text-white
    px-3 py-1.5
    sm:px-4 sm:py-2
    md:px-5 md:py-2.5
    text-sm sm:text-base
    rounded-lg transition
  "
            >
              Filter
              <svg
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                  showFilter ? 'rotate-180' : ''
                }`}
                viewBox="0 0 10 6"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
                />
              </svg>
            </button>

            {showFilter && (
              <>
                {/* 🟣 Desktop Sidebar ثابت */}
                <div className="hidden md:block absolute top-full mt-2 left-0 z-50">
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

                {/* 🔵 Mobile Modal */}
                <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
                  <div
                    className="
      bg-white 
      w-full 
      rounded-t-2xl 
      shadow-xl 
      p-5 
      max-h-[75vh] 
      overflow-y-auto 
      animate-slideUp
    "
                  >
                    {/* Close Button */}
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={() => setShowFilter(false)}
                        className="text-gray-600 text-2xl"
                      >
                        <X size={22} />
                      </button>
                    </div>

                    {/* Sidebar Content */}
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
                </div>
              </>
            )}
          </div>

          <div className="text-gray-700 font-medium">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 && 's'}
          </div>
        </div>

        {/* ⭐ GRID */}
        {loading ? (
          // ⭐ Skeleton أثناء التحميل
          <div
            className=" grid 
  grid-cols-2      /* موبايل صغير جداً */
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  xl:grid-cols-4 
  gap-4 sm:gap-6 md:gap-8"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProduct key={i} />
            ))}
          </div>
        ) : currentProducts.length > 0 ? (
          // ⭐ المنتجات بعد اللود
          <div
            className=" grid 
  grid-cols-2      /* موبايل صغير جداً */
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  xl:grid-cols-4 
  gap-4 sm:gap-6 md:gap-8"
          >
            {currentProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-12">لا توجد منتجات.</p>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`
    px-3 py-1.5
    sm:px-4 sm:py-2
    rounded-lg border text-sm sm:text-base
    ${
      currentPage === i + 1
        ? 'bg-pink-600 text-white'
        : 'bg-white hover:bg-gray-100'
    }
  `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* ⭐ Shimmer Animation */}
        <style>
          {`
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slideUp {
  animation: slideUp 0.35s ease-out;
}
`}
        </style>

        <div className="animate-[shimmer_1300ms_infinite]"></div>
      </section>
    </div>
  );
};

export default AllProductsPage;
