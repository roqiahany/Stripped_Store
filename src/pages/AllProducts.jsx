import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { motion } from 'framer-motion';
import CategoriesSection from './../components/CategoriesSection';
import TrendingNowSection from './../components/TrendingNowSection';
import { useNavigate } from 'react-router-dom';
import ProductCard from './../components/ProductDetails/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === 'الكل'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // ⭐⭐⭐ Skeleton Component (Shimmer + Blur + Professional)
  const SkeletonCard = () => (
    <div className="relative overflow-hidden rounded-xl">
      <div className="h-[450px] w-full bg-gray-300 rounded-xl blur-[1px] relative">
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                        animate-[shimmer_1.6s_infinite]"
        ></div>
      </div>

      {/* Skeleton Text */}
      <div className="mt-4 space-y-3 px-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
  // ⭐ نهاية الـ Skeleton

  return (
    <div className="p-6">
      {/* Section التصنيفات */}
      <CategoriesSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 tracking-wide text-left">
          Shop All
        </h2>

        {/* شبكة الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" dir="ltr">
          {loading ? (
            // ⭐⭐⭐ عرض 6 سكلتون
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-2 text-center">
              لا توجد منتجات في هذا التصنيف
            </p>
          ) : (
            filteredProducts
              .slice(0, 12)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  imageHeight="h-[450px]"
                />
              ))
          )}
        </div>

        {/* زرار View All */}
        {filteredProducts.length > 12 ||
          (filteredProducts.length < 12 && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate('/all-products')}
                className="px-8 py-3 bg-pink-600 text-white font-medium rounded-full hover:bg-pink-700 transition-colors duration-300"
              >
                View All
              </button>
            </div>
          ))}
      </div>

      <TrendingNowSection />
    </div>
  );
}

/* Shimmer Animation */
<style>
  {`
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`}
</style>;
