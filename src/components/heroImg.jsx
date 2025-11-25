import imgbanner from '../assets/imgBanner.png';
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
        className="w-full  sm:h-[500px] md:h-[600px] lg:h-[750px] object-cover opacity-80"
      />

      {/* المحتوى فوق الصورة */}
      <div className="absolute inset-0 flex flex-col items-center justify-center sm:justify-end pb-12 sm:pb-16 text-center text-white px-4">
        <a
          onClick={() => navigate('/all-products')}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md transition"
        >
          Shop all
        </a>
      </div>
    </section>
  );
};

export default ImageBanner;
