// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [showSlider, setShowSlider] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const categories = [
    'الكل',
    'طرح شيفون',
    'طرح قطن',
    'طرح ستان',
    'طرح ليكرا',
    'طرح كريب',
  ];

  const handelSignInAdmin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === 'الكل'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const openSlider = (images, index = 0) => {
    setSliderImages(images);
    setCurrentIndex(index);
    setShowSlider(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sliderImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="p-6">
      {/* تبويبات التصنيفات */}
      <div className="flex gap-3 mb-6">
        <button onClick={handelSignInAdmin}> signIn Admin</button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === cat
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* عرض المنتجات حسب التصنيف */}
      <div className="grid grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center">
            لا توجد منتجات في هذا التصنيف
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => openSlider(product.images || [])}
            >
              <img
                src={product.images?.[0] || '/no-image.png'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-bold mt-2">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-pink-600 font-semibold mt-1">
                {product.price} LE
              </p>
            </div>
          ))
        )}
      </div>

      {/* مودال السلايدر */}
      {showSlider && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowSlider(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <div className="flex items-center justify-center">
              <button
                onClick={prevImage}
                className="px-2 text-xl text-gray-700 hover:text-black"
              >
                ‹
              </button>

              <img
                src={sliderImages[currentIndex]}
                alt=""
                className="max-h-96 object-contain mx-4"
              />

              <button
                onClick={nextImage}
                className="px-2 text-xl text-gray-700 hover:text-black"
              >
                ›
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-2">
              {currentIndex + 1} / {sliderImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
