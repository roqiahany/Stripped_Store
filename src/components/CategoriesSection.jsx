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
    <div className="relative overflow-hidden rounded-2xl shadow-lg w-full aspect-[4/5]">
      {/* نفس ارتفاع الصورة الحقيقية */}
      <div className="w-full h-full bg-gray-300 rounded-2xl blur-[0.5px] relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.6s_infinite]"></div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-50" id="categories">
      <div className="container mx-auto px-6">
        {/* العنوان */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-12 text-left">
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
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-500"
                  onClick={() => navigate(`/category/${cat.name}`)}
                >
                  {/* Perspective container للtilt */}
                  <div
                    className="w-full aspect-[4/5] perspective"
                    style={{ perspective: 1200 }}
                  >
                    <motion.div
                      className="relative w-full h-full overflow-hidden rounded-3xl"
                      whileHover={{
                        scale: 1.1,
                        rotateX: 6,
                        rotateY: 6,
                        transition: {
                          type: 'spring',
                          stiffness: 140,
                          damping: 12,
                        },
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* الصورة */}
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out"
                      />

                      {/* Overlay gradient + dark layer */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

                      {/* subtle glow */}
                      <div className="absolute inset-0 pointer-events-none bg-white/5 shadow-[0_0_50px_10px_rgba(255,192,203,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </motion.div>
                  </div>

                  {/* الاسم والArrow */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg group-hover:text-pink-400 transition-colors duration-500">
                      {cat.name}
                    </h3>
                    <ArrowRight className="text-white group-hover:text-pink-400 transition-all duration-300 translate-x-0 group-hover:translate-x-2" />
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
