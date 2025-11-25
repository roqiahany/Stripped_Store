import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductDetails/ProductCard';

export default function TrendingNowSection() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('category', '==', 'Trending now')
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrendingProducts(items.slice(0, 8));
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // ⭐⭐⭐ Skeleton
  const SkeletonCard = () => (
    <div className="relative overflow-hidden rounded-xl">
      <div className="h-[500px] w-full bg-gray-300 rounded-xl blur-[1px] relative">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                        animate-[shimmer_1.6s_infinite]"
        ></div>
      </div>

      <div className="mt-4 space-y-3 px-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 tracking-wide text-left">
        Trending Now
      </h2>

      {/* شبكة المنتجات */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8"
        dir="ltr"
      >
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : trendingProducts.length === 0 ? (
          <p className="text-gray-500 col-span-4 text-center">
            لا توجد منتجات في هذا التصنيف الآن
          </p>
        ) : (
          trendingProducts
            .slice(0, 6)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                imageHeight="h-[500px]"
              />
            ))
        )}
      </div>

      {/* زرار View All */}
      {!loading && trendingProducts.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate('/trending')}
            className="px-8 py-3 bg-pink-600 text-white font-medium rounded-full hover:bg-pink-700 transition-colors duration-300"
          >
            View All
          </button>
        </div>
      )}

      {/* Shimmer Animation */}
      <style>
        {`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        `}
      </style>
    </div>
  );
}
