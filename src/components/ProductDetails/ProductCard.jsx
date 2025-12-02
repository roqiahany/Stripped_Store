import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ProductCard({
  product,
  imageHeight = 'h-[350px]',
  yOffset = 40,
  delay = 0,
  duration = 0.6,
  priceSize = 'text-base',
  onClick,
}) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="group relative overflow-hidden cursor-pointer rounded-xl shadow-md bg-white"
      onClick={
        onClick
          ? onClick
          : () => navigate(`/product/${product.id}`, { state: { product } })
      }
    >
      {/* الصورة */}
      <div
        className={`relative overflow-hidden ${imageHeight} flex items-center justify-center bg-gray-100 rounded-t-xl`}
      >
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-xl"></div>
        )}
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

      {/* تفاصيل المنتج */}
      <div className="p-4 flex flex-col gap-2" dir="ltr">
        {/* اسم المنتج */}
        <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-800 group-hover:underline transition-all duration-500 text-left">
          {product.name}
        </h3>

        {/* السعر */}
        <p
          className={`text-pink-600 font-semibold text-sm sm:text-base md:text-lg text-left`}
        >
          {product.price} LE
        </p>

        {/* Category */}
        {product.category && (
          <p className="text-gray-500 text-xs sm:text-sm md:text-base text-left">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-semibold text-gray-500 text-xs sm:text-sm md:text-base">
              Sizes:
            </span>
            {product.sizes.map((sizeObj, index) => (
              <span
                key={sizeObj.name || index}
                className="px-2 py-0.5 border rounded-md text-[10px] sm:text-xs md:text-sm bg-gray-100"
              >
                {sizeObj.name}
              </span>
            ))}
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 text-xs sm:text-sm md:text-base">
              Colors:
            </span>
            <div className="flex gap-1 flex-wrap">
              {product.colors.map((c) => (
                <div
                  key={c.name}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border"
                  title={c.name}
                  style={{ backgroundColor: c.name }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sold Out */}
        {product.soldOut && (
          <p className="text-red-600 font-semibold text-xs sm:text-sm md:text-base mt-1">
            Sold Out
          </p>
        )}
      </div>
    </motion.div>
  );
}
