import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({
  product,
  imageHeight = 'h-[500px]',
  yOffset = 40,
  delay = 0,
  duration = 0.6,
  priceSize = 'text-base',
  onClick,
}) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false); // ⬅️ لتفعيل البلير و اللودينج

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="group relative overflow-hidden cursor-pointer"
      onClick={
        onClick
          ? onClick
          : () => navigate(`/product/${product.id}`, { state: { product } })
      }
    >
      {/* الصورة */}
      <div
        className={`relative overflow-hidden rounded-xl ${imageHeight} flex items-center justify-center bg-gray-100`}
      >
        {/* ⭐ Skeleton Loader قبل تحميل الصورة */}
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl"></div>
        )}

        {/* ⭐ الصورة مع lazy + blur */}
        <img
          src={product.images?.[0] || '/no-image.png'}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover object-center transition duration-700 ease-in-out 
            ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}
            group-hover:scale-105
          `}
          style={{ objectPosition: 'center top' }}
        />
      </div>

      {/* الاسم والسعر */}
      <div className="mt-3 text-center pb-4">
        <h3 className="text-lg font-medium text-gray-800 group-hover:underline transition-all duration-500">
          {product.name}
        </h3>
        <p className={`text-pink-600 font-semibold mt-1 ${priceSize}`}>
          {product.price} LE
        </p>
      </div>
    </motion.div>
  );
}
