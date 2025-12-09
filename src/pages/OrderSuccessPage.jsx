import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer';

export default function OrderSuccess() {
  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h1 className="text-4xl font-semibold text-green-600 mb-4">
          ✔ تم إرسال طلبك بنجاح!
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          سيتم التواصل معك لتأكيد الطلب في أقرب وقت.
        </p>

        <Link
          to="/all-products"
          className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700"
        >
          العودة للتسوق
        </Link>
      </div>

      <Footer />
    </>
  );
}
