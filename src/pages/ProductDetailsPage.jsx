import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Navbar from '../components/Navbar/Navbar';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NextArrow, PrevArrow } from '../components/ProductDetails/Arrows';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ProductCard from '../components/ProductDetails/ProductCard';
import Footer from './../components/footer';
import { useCart } from '../context/CartContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // states
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [currentImage, setCurrentImage] = useState(
    product ? product.images?.[0] : '/no-image.png'
  );
  const [imageLoaded, setImageLoaded] = useState(false); // for main image skeleton/blur
  const [showAllColors, setShowAllColors] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // reset imageLoaded when currentImage changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentImage]);

  // change main image when user selects a size (if size has image)
  useEffect(() => {
    if (!selectedSize) return;

    // لو selectedSize كائن وفيه field image
    if (typeof selectedSize === 'object' && selectedSize.image) {
      setCurrentImage(selectedSize.image);
      return;
    }

    // لو selectedSize مجرد string — ممكن ما يكونش عنده صورة مرتبطة
    // لو عندك logic mapping من sizeName -> صورة تانية، ضيفيه هنا
  }, [selectedSize]);

  // fetch product (always fetch to ensure fresh data)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedProduct = { id: docSnap.id, ...docSnap.data() };
          setProduct(fetchedProduct);
          setCurrentImage(fetchedProduct.images?.[0] || '/no-image.png');
          setActiveColorIndex(0);

          // ✨ اختر أول مقاس افتراضياً إذا متوفر عشان يظهر الـ selected state فوراً
          setSelectedSize(fetchedProduct.sizes?.[0] || null);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  // fetch recommended after product is available
  useEffect(() => {
    const fetchRecommended = async () => {
      if (!product) {
        setRecommendedProducts([]);
        setLoadingRecommended(false);
        return;
      }

      try {
        setLoadingRecommended(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const allProducts = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        const filtered = allProducts.filter((p) => p.id !== product.id);
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        setRecommendedProducts(selected);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setRecommendedProducts([]);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommended();
  }, [product]);

  // quantity handlers
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleColorClick = (color, index) => {
    setActiveColorIndex(index);

    // لو اللون عنده image → استعمله مباشرة
    if (color.image) {
      setCurrentImage(color.image);
      return;
    }

    // لو مفيش صورة في اللون → استخدم صورة المقاس
    if (
      selectedSize &&
      typeof selectedSize === 'object' &&
      selectedSize.image
    ) {
      setCurrentImage(selectedSize.image);
      return;
    }

    // لو مفيش أي صورة → خلي الصورة الحالية بدون تغيير
  };

  const handleAddToCart = () => {
    if (!product) return;
    const productWithSelectedOptions = {
      ...product,
      selectedColor: product.colors?.[activeColorIndex] || null,
      selectedSize: selectedSize || null,
      selectedImage: currentImage,
    };
    addToCart(productWithSelectedOptions, quantity, selectedSize);
    navigate('/cart');
  };

  // slider settings (same as yours)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <ul className="absolute bottom-4 flex justify-center gap-2 w-full">
        {dots}
      </ul>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 rounded-full bg-pink-300 hover:bg-pink-500"></div>
    ),
  };

  // --------- RENDERING ---------
  if (loadingProduct) {
    // full-page skeleton while main product loads
    return (
      <div dir="ltr" className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          {/* image skeleton */}
          <div>
            <div className="w-full h-[400px] bg-gray-200 rounded-xl"></div>
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>

          {/* details skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-8 bg-gray-200 w-2/3 rounded"></div>
            <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 w-1/2 rounded mt-6"></div>
          </div>
        </div>

        {/* recommended skeleton */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-left">
            You may also like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="h-[300px] bg-gray-200"></div>
                <div className="h-4 bg-gray-200 mt-3 w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 mt-2 w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        المنتج غير موجود 😢
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-2 gap-8"
        dir="ltr"
      >
        {/* === جزء الصور === */}
        <div className="w-full flex flex-col items-center">
          {/* السلايدر */}
          <div className="relative w-full flex justify-center">
            <Slider
              {...sliderSettings}
              className="w-full max-w-[clamp(280px,90vw,650px)]"
            >
              <div className="flex justify-center items-center overflow-hidden relative">
                {/* main image skeleton overlay */}
                {!imageLoaded && (
                  <div className="absolute inset-0 rounded-xl bg-gray-200 animate-pulse z-10"></div>
                )}

                <div className="relative w-full flex justify-center group">
                  <img
                    src={currentImage}
                    alt={product.name}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className="w-full h-[clamp(220px,45vw,550px)] object-cover rounded-xl shadow-lg transition-all duration-700 ease-in-out"
                  />

                  {/* أيقونة التكبير تظهر عند الهوف */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-xl"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <span className="text-white text-4xl font-bold">+</span>
                  </div>
                </div>
              </div>
            </Slider>

            {isLightboxOpen && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                {/* زر غلق */}
                <button
                  className="absolute top-4 right-4 text-white text-3xl font-bold"
                  onClick={() => setIsLightboxOpen(false)}
                >
                  ×
                </button>

                {/* الصورة المكبرة */}
                <img
                  src={currentImage}
                  alt={product.name}
                  className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
                />
              </div>
            )}

            {product.soldOut && (
              <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-[clamp(10px,2.5vw,14px)] font-semibold rounded">
                Sold Out
              </span>
            )}
          </div>

          {/* === جزء الألوان === */}
          <div className="flex flex-col gap-2 mt-4 w-full max-w-[clamp(280px,90vw,600px)] mx-auto">
            <div className="relative w-full">
              {/* left arrow */}
              <button
                onClick={() => {
                  document
                    .getElementById('colorsScroll')
                    ?.scrollBy({ left: -100, behavior: 'smooth' });
                }}
                className="aspect-square h-8 flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 rounded-full p-2 shadow-md hover:bg-white transition z-10"
              >
                ‹
              </button>

              {/* colors strip */}
              <div
                id="colorsScroll"
                className="flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth py-2 px-8"
              >
                {product.colors?.map((color, index) => (
                  <div
                    key={color.name || index}
                    className="relative group flex-shrink-0"
                  >
                    <button
                      onClick={() => handleColorClick(color, index)}
                      className={`aspect-square rounded-full overflow-hidden flex items-center justify-center transition-transform duration-200
                        ${
                          activeColorIndex === index
                            ? 'border-2 border-pink-600 scale-110'
                            : 'border-2 border-gray-300'
                        }
                      `}
                      style={{
                        width: 'clamp(40px,10vw,60px)',
                        height: 'clamp(40px,10vw,60px)',
                      }}
                    >
                      <img
                        src={color.image}
                        alt={color.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* right arrow */}
              <button
                onClick={() => {
                  document
                    .getElementById('colorsScroll')
                    ?.scrollBy({ left: 100, behavior: 'smooth' });
                }}
                className="aspect-square h-8 flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 rounded-full p-2 shadow-md hover:bg-white transition z-10"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* === جزء التفاصيل === */}
        <div className="flex flex-col justify-start space-y-4 px-4 sm:px-6 md:px-0">
          <p className="text-gray-500 text-[clamp(12px,2.5vw,16px)] text-start">
            Stripped Store
          </p>

          <div className="flex items-center gap-2">
            <h2 className="text-[clamp(20px,5vw,30px)] font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>
          </div>

          {/* السعر */}
          <p className="text-start text-[clamp(18px,4vw,24px)] font-extrabold text-pink-600">
            {product.price} EGP
          </p>

          {/* === جزء المقاسات === */}
          <div className="w-full max-w-[clamp(280px,90vw,600px)] mx-auto mt-6">
            <h3 className="text-[clamp(14px,3vw,18px)] font-semibold text-gray-800 mb-2 text-start">
              Select Size
            </h3>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {product.sizes?.map((size, index) => {
                const sizeObj =
                  typeof size === 'string' ? { name: size } : size;
                const isActive =
                  selectedSize?.name === sizeObj.name ||
                  selectedSize === sizeObj.name;

                return (
                  <button
                    key={sizeObj.name || index}
                    onClick={() => {
                      setSelectedSize(sizeObj);
                      if (sizeObj.image) {
                        if (sizeObj.image === currentImage) {
                          setCurrentImage(sizeObj.image);
                          setImageLoaded(true);
                        } else {
                          setImageLoaded(false);
                          setCurrentImage(sizeObj.image);
                        }
                      }
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-lg border transition-all text-[clamp(12px,2.5vw,14px)] sm:text-sm font-medium ${
                      isActive
                        ? 'border-pink-600 bg-pink-50 text-pink-700 scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {sizeObj.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* === الكمية === */}
          <div className="flex flex-col items-start gap-2">
            <div className="text-gray-700 font-medium text-[clamp(12px,2.5vw,16px)]">
              Quantity
            </div>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={incrementQuantity}
                disabled={product.soldOut}
                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-gray-800 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>

              <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-[clamp(14px,3vw,18px)]">
                {quantity}
              </div>

              <button
                onClick={decrementQuantity}
                disabled={quantity === 1 || product.soldOut}
                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-gray-800 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <MinusIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>

          {/* === الأزرار === */}
          <div className="flex flex-col gap-4 mt-6">
            {product.soldOut ? (
              <button
                disabled
                className="w-full py-3 rounded-lg text-white font-semibold bg-gray-400 cursor-not-allowed text-[clamp(14px,3vw,18px)]"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-lg text-white font-semibold bg-pink-600 hover:bg-pink-700 transition text-[clamp(14px,3vw,18px)]"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* recommended */}
      <div className="max-w-7xl mx-auto px-6 pb-12" dir="ltr">
        {loadingRecommended ? (
          <div className="mt-16 w-full ">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-left">
              You may also like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="h-[300px] bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 mt-3 w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 mt-2 w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          recommendedProducts.length > 0 && (
            <div className="mt-16 w-full ">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-left">
                You may also like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recommendedProducts.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    imageHeight="h-[450px] sm:h-[350px] md:h-[400px]"
                    yOffset={30}
                    delay={index * 0.1}
                    duration={0.5}
                    priceSize="text-sm"
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <Footer />

      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={currentImage}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // عشان الضغط على الصورة نفسها لا يغلق
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            onClick={() => setIsLightboxOpen(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
