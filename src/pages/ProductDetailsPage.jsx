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
import toast from 'react-hot-toast';
import { useRef } from 'react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // states
  const [firstLoad, setFirstLoad] = useState(true);

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = product?.colors?.[activeColorIndex] || null;
  const [activeColorProduct, setActiveColor] = useState(null);

  const [currentImage, setCurrentImage] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false); // for main image skeleton/blur
  const [showAllColors, setShowAllColors] = useState(false);
  const lightboxRef = useRef(null);

  const lightboxSliderRef = useRef(null); // 🔥 سلايدر اللايت بوكس

  const images = product?.images || [];

  const { addToCart } = useCart();
  const productColor = product?.colors?.[0];
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

  const colorName = product?.colors?.[0]?.name; // مثلا "Black_Obsidian_Onyx"
  const colorHex = colorName ? colorMap[colorName] : null;

  // const images = product.images || [currentImage];

  useEffect(() => {
    if (product?.colors?.length) {
      setActiveColor(product.colors[0]);
    }
  }, [product]);

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

  useEffect(() => {
    // 🔥 reset كل حاجة لها علاقة بالمنتج القديم
    setProduct(null);

    setCurrentImage(null);
    setSelectedSize(null);
    setActiveColorIndex(0);
    setQuantity(1);
    setImageLoaded(false);
    setIsLightboxOpen(false);
  }, [id]);

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
          setCurrentImage(
            fetchedProduct.colors?.[0]?.image ||
              fetchedProduct.images?.[0] ||
              '/no-image.png'
          );
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

  useEffect(() => {
    if (!product?.images?.length) return;

    const preloadImages = async () => {
      await Promise.all(
        product.images.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
            })
        )
      );
    };

    preloadImages();
  }, [product]);

  // quantity handlers
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleColorClick = (color, index) => {
    setActiveColorIndex(index);

    if (typeof color.imageIndex === 'number') {
      sliderRef.current?.slickGoTo(color.imageIndex);
      setCurrentImage(product.images[color.imageIndex]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !activeColor) {
      toast.error('Please select color and size');
      return;
    }

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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false,
    accessibility: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    // appendDots: (dots) => (
    //   <ul className="absolute bottom-4 flex justify-center gap-2 w-full">
    //     {dots.map((dot, index) => (
    //       <li
    //         key={index}
    //         onClick={() => sliderRef.current?.slickGoTo(index)}
    //         className="cursor-pointer"
    //       >
    //         {dot.props.children}
    //       </li>
    //     ))}
    //   </ul>
    // ),

    // customPaging: () => (
    //   <div className="w-3 h-3 rounded-full bg-pink-300 hover:bg-pink-500 transition" />
    // ),

    afterChange: (currentSlide) => {
      const colorIndex = product.colors?.findIndex(
        (c) => c.imageIndex === currentSlide
      );

      if (colorIndex !== -1) {
        setActiveColorIndex(colorIndex);
      }

      setCurrentImage(product.images[currentSlide]);
      setImageLoaded(false);
    },
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKey = (e) => {
      if (e.key === 'ArrowRight') lightboxSliderRef.current?.slickNext();
      if (e.key === 'ArrowLeft') lightboxSliderRef.current?.slickPrev();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen]);

  // useEffect(() => {
  //   setImageLoaded(false);
  // }, [currentImage]);

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
              key={product.id}
              ref={sliderRef}
              {...sliderSettings}
              className="w-full max-w-[clamp(280px,90vw,650px)]"
            >
              {images.map((img, index) => (
                <div key={index} className="flex justify-center">
                  <div className="relative w-full bg-white rounded-xl group flex justify-center overflow-hidden">
                    <img
                      src={img}
                      onLoad={() => setImageLoaded(true)}
                      alt={product.name}
                      loading="eager"
                      className={`transition duration-500 
                     
            rounded-xl
            w-auto
            max-w-full
            h-auto
            max-h-[80vh]
            object-contain
          
            ease-in-out
            group-hover:scale-105
          `}
                    />

                    {/* Hover */}
                    <div
                      className="
            absolute inset-0
            flex items-center justify-center
            bg-black/30
            opacity-0
            group-hover:opacity-100
            transition
            cursor-pointer
            rounded-xl
          "
                      onClick={() => {
                        setCurrentImage(img);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <span className="text-white text-4xl font-bold">+</span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            {isLightboxOpen && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                tabIndex={-1}
                ref={lightboxRef}
              >
                <div className="relative w-full max-w-4xl px-4">
                  <button
                    className="absolute -top-10 right-2 text-white text-4xl font-bold z-50"
                    onClick={() => setIsLightboxOpen(false)}
                  >
                    ×
                  </button>

                  <Slider
                    // key={currentImage}
                    ref={lightboxSliderRef}
                    initialSlide={product.images.indexOf(currentImage)}
                    infinite
                    arrows
                    slidesToShow={1}
                    slidesToScroll={1}
                    speed={500}
                    accessibility={true}
                  >
                    {product.images.map((img, index) => (
                      <div
                        key={index}
                        className="flex justify-center items-center"
                      >
                        <img
                          src={img}
                          onLoad={() => setImageLoaded(true)}
                          alt=""
                          className={`block    mx-auto transition duration-500 ${
                            imageLoaded ? 'blur-0' : 'blur-md'
                          }
                          max-h-[90vh] max-w-[90vw] object-contain rounded-lg mx-auto" `}
                          loading="eager"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
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
              <div className="flex gap-3 justify-start">
                {product.colors?.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorClick(color, index)}
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden
        ${
          activeColorIndex === index
            ? 'border-pink-600 scale-110'
            : 'border-gray-300'
        }`}
                  >
                    <img
                      onLoad={() => setFirstLoad(false)}
                      src={color.image}
                      alt={color.name}
                      className={`w-full h-full object-cover
                      transition duration-500 ${
                        firstLoad ? 'blur-md' : 'blur-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
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

          {/* description */}
          {product.description && (
            <p className="text-gray-700 text-[clamp(14px,3vw,16px)] text-start whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* === لون المنتج === */}
          {productColor && (
            <div className="mt-6">
              <h3 className="text-[clamp(14px,3vw,18px)] font-semibold text-gray-800 mb-2 text-start">
                Color
              </h3>

              <div className="flex items-center gap-3">
                {/* الدايرة */}

                <div
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: colorHex || '#fff', // fallback لو اللون مش موجود
                  }}
                />

                {/* اسم اللون */}
                <span className="text-gray-700 ml-2">
                  {colorName.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          )}

          {/* === جزء المقاسات === */}
          <div className="w-full max-w-[clamp(280px,90vw,600px)] mx-auto mt-6">
            <h3 className="text-[clamp(14px,3vw,18px)] font-semibold text-gray-800 mb-2 text-start">
              Select Size
            </h3>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {activeColor?.sizes?.map((size, index) => {
                const isDisabled =
                  size.available === false || size.inStock === false;
                const isActive = selectedSize?.name === size.name;

                return (
                  <button
                    key={size.name || index}
                    disabled={isDisabled}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 sm:px-4 py-2 rounded-lg border transition-all text-sm font-medium
          ${
            isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isActive
              ? 'border-pink-600 bg-pink-50 text-pink-700 scale-105'
              : 'border-gray-300 bg-white hover:border-gray-500'
          }
        `}
                  >
                    {size.name}
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
    </div>
  );
}

// import { useRef, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar/Navbar';
// import Footer from '../components/footer';
// import { useCart } from '../context/CartContext';

// import { useProductDetails } from '../components/ProductDetails/useProductDetails';
// import ProductImageSlider from '../components/ProductDetails/ProductImageSlider';
// import ProductLightbox from '../components/ProductDetails/ProductLightbox';
// import ProductColors from '../components/ProductDetails/ProductColors';
// import ProductSizes from '../components/ProductDetails/ProductSizes';
// import ProductQuantity from '../components/ProductDetails/ProductQuantity';
// import ProductInfo from '../components/ProductDetails/ProductInfo';
// import RecommendedProducts from '../components/ProductDetails/RecommendedProducts';

// import toast from 'react-hot-toast';

// export default function ProductDetailsPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const sliderRef = useRef(null);

//   const { product, recommendedProducts, loadingProduct, loadingRecommended } =
//     useProductDetails(id);

//   const { addToCart } = useCart();

//   const [activeColorIndex, setActiveColorIndex] = useState(0);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [lightboxImage, setLightboxImage] = useState(null);

//   if (loadingProduct) return null;
//   if (!product) return <div>المنتج غير موجود</div>;

//   const images = product.images || [];
//   const activeColor = product.colors?.[activeColorIndex];

//   const handleAddToCart = () => {
//     if (!selectedSize || !activeColor) {
//       toast.error('Please select color and size');
//       return;
//     }

//     addToCart(
//       {
//         ...product,
//         selectedColor: activeColor,
//         selectedSize,
//       },
//       quantity
//     );

//     navigate('/cart');
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
//         <div>
//           <ProductImageSlider
//             images={images}
//             sliderRef={sliderRef}
//             onImageClick={setLightboxImage}
//           />

//           <ProductColors
//             colors={product.colors}
//             activeIndex={activeColorIndex}
//             onSelect={(_, i) => setActiveColorIndex(i)}
//           />
//         </div>

//         <div className="space-y-4">
//           <ProductInfo product={product} />

//           <ProductSizes
//             sizes={activeColor?.sizes}
//             selectedSize={selectedSize}
//             onSelect={setSelectedSize}
//           />

//           <ProductQuantity
//             quantity={quantity}
//             onIncrease={() => setQuantity((q) => q + 1)}
//             onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
//             disabled={product.soldOut}
//           />

//           <button
//             onClick={handleAddToCart}
//             className="bg-pink-600 text-white py-3 rounded-lg"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>

//       <RecommendedProducts
//         products={recommendedProducts}
//         loading={loadingRecommended}
//       />

//       {lightboxImage && (
//         <ProductLightbox
//           images={images}
//           currentImage={lightboxImage}
//           onClose={() => setLightboxImage(null)}
//         />
//       )}

//       <Footer />
//     </>
//   );
// }
