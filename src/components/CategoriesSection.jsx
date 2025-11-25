import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      try {
        setLoading(true);
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const products = productsSnapshot.docs.map((doc) => doc.data());

        const categoryMap = new Map();

        products.forEach((product) => {
          const category = product.category;
          const firstImage = product.images?.[0];
          if (category && firstImage && !categoryMap.has(category)) {
            categoryMap.set(category, firstImage);
          }
        });

        const formatted = Array.from(categoryMap, ([name, image]) => ({
          name,
          image,
        }));

        // حتى لو البيانات رجعت بسرعة، خلي الـ skeleton ظاهر نص ثانية على الأقل
        setTimeout(() => {
          setCategories(formatted);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategoriesWithImages();
  }, []);

  const SkeletonCard = () => (
    <div className="relative overflow-hidden rounded-xl shadow-md w-full">
      {/* نفس ارتفاع الصورة الحقيقية */}
      <div className="w-full h-[450px] bg-gray-300 rounded-xl blur-[0.5px] relative overflow-hidden">
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r 
        from-transparent via-white/30 to-transparent 
        animate-[shimmer_1.6s_infinite]"
        ></div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-50" id="categories">
      <div className="container mx-auto px-6">
        {/* العنوان */}
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-left">
          Shop by Category
        </h2>

        {/* الكروت */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
          dir="ltr"
        >
          {loading
            ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            : categories.map((cat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/category/${cat.name}`)}
                >
                  {/* الصورة */}
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition duration-300 aspect-[4/5]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* الاسم والسهم */}
                  <div className="flex items-center mt-4 px-1">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition">
                      {cat.name}
                    </h3>
                    <ArrowRight className="text-pink-600 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
