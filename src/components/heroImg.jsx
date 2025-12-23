import imgbanner from '../assets/img-Banner-2.jpg';
import AllProductsPage from './../pages/AllProductsPage';
import { useNavigate } from 'react-router-dom';
const ImageBanner = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full overflow-hidden ">
      {/* الصورة الخلفية */}
      <img
        src={imgbanner}
        alt="Banner"
        className="w-full  sm:h-[500px] md:h-[600px] lg:h-[750px] object-cover opacity-95"
      />

      {/* المحتوى فوق الصورة */}
      <div className="absolute inset-0 flex flex-col items-center justify-end sm:justify-end pb-8 sm:pb-12 text-center text-white px-4">
        <a
          onClick={() => navigate('/all-products')}
          className="
    bg-pink-600 hover:bg-pink-700 text-white
    px-4 py-2 
    sm:px-5 sm:py-2.5
    md:px-6 md:py-3
    text-sm sm:text-base md:text-lg
    rounded-md transition
    font-medium
  "
        >
          Shop all
        </a>
      </div>
    </section>
  );
};

export default ImageBanner;
