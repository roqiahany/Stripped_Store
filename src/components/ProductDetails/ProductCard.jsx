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

  const allSizes =
    product.colors?.flatMap((color) =>
      color.sizes?.filter((s) => s.available )
    ) || [];

  const uniqueSizes = Array.from(
    new Map(allSizes.map((s) => [s.name, s])).values()
  );

    const colorMap = {
    Black_Obsidian_Onyx: '#353839',

    Onyx_Black: '#0B0B0B',
    Moonstone_Beige: '#D6C6B8',
    Sapphire_Blue: '#0F52BA',
    Emerald_Green: '#50C878',
    Midnight_Onyx: '#2C2F33',
    Champagne_Quartz: '#F7E7CE',
    Blue_Chalcedony: '#A9C6C2',
    models: '#808080',
    packages: '#FFD700',
  }; 


  const colorName = product.colors[0].name; // مثلا "Black_Obsidian_Onyx"
const colorHex = colorMap[colorName]; // "#353839"

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
        {/* {product.category && (
          <p className="text-gray-500 text-xs sm:text-sm md:text-base text-left">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
        )}
 */}

  
       {/* Colors */}
{product.colors?.[0] && (
  <div className="flex items-center gap-2 mt-2">
    <div
      className="w-4 h-4 rounded-full border border-gray-300"
      style={{
        backgroundColor: colorMap[product.colors[0].name] || '#fff',
      }}
    />
    <span className="text-gray-700 text-sm">
      {product.colors[0].name.replace(/_/g, ' ')}
    </span>
  </div>
)}

      </div>
    </motion.div>
  );
}
