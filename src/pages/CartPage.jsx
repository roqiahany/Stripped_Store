import { useState } from 'react';
import { useCart } from '../context/CartContext';
import SkeletonRow from '../admin/components/SkeletonRow';
import Navbar from './../components/Navbar/Navbar';
import Footer from '../components/footer';
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { MinusIcon } from '@heroicons/react/24/solid';
import AllProductsPage from './AllProductsPage';
import CheckoutPage from './CheckoutPage';
import CartPromotion from './CartPromotion';

export default function CartPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    cart,
    removeFromCart,

    incrementQuantity,
    decrementQuantity,
  } = useCart();

  // const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.quantity,
    0
  );

  if (cart.length === 0)
    return (
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* محتوى الصفحة */}
        <main
          className="flex-grow flex flex-col justify-center items-center max-w-7xl mx-auto px-6 gap-5"
          dir="ltr"
        >
          <h1
            className="text-3xl font-light text-gray-800 tracking-wide capitalize"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Your cart is empty
          </h1>

          <Link
            to="/all-products"
            className="bg-pink-600 text-white px-10 py-3 my-2 rounded-lg hover:bg-pink-700 transition"
          >
            Continue shopping
          </Link>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    );

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = 'مرحبا! أريد طلب المنتجات التالية:\n\n';

    cart.forEach((item, index) => {
      const imageUrl =
        item.selectedImage || item.image || item.images?.[0] || 'لا توجد صورة';
      message += `${index + 1}. ${item.name}
 اللون: ${item.selectedColor?.name || 'لا يوجد'}
 الكمية: ${item.quantity}
السعر: ${item.finalPrice || item.price} EGP
 الصورة: ${imageUrl}
 الحجم: ${item.selectedSize?.name || 'لا يوجد'}

--------------------------\n`;
    });

    message += `\nالإجمالي الكلي: ${total.toFixed(2)} EGP`;

    const phoneNumber = '201117194095'; // رقمك بدون علامة +
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, '_blank');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-6 pb-16">
        <div
          className="max-w-7xl mx-auto px-6 flex justify-between items-center py-10"
          dir="ltr"
        >
          <h1
            className="text-5xl font-light text-gray-800 tracking-wide capitalize"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Your cart
          </h1>
          <Link
            to="/all-products"
            className="text-gray-700 font-semibold underline decoration-2 decoration-pink-500 hover:decoration-pink-700 hover:text-pink-700 transition"
          >
            Continue shopping
          </Link>
        </div>
        <div
          className="max-w-7xl mx-auto px-6 overflow-x-auto bg-white"
          dir="ltr"
        >
          <table className="w-full border-collapse">
            {/* رأس الجدول */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-left text-gray-500 text-sm font-normal tracking-wide">
                  Product
                </th>
                <th className="py-4 px-4 text-center text-gray-500 text-sm font-normal tracking-wide">
                  Quantity
                </th>
                <th className="py-4 px-4 text-center text-gray-500 text-sm font-normal tracking-wide">
                  Total
                </th>
              </tr>
            </thead>

            {/* محتوى الجدول */}
            <tbody>
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => <SkeletonRow key={i} />)
                : cart.map((item) => (
                    <tr
                      key={item.id + (item.selectedSize?.name || '')}
                      className="border-b border-gray-100  "
                    >
                      {/* المنتج */}
                      <td className="flex flex-col sm:flex-row items-center gap-5 py-5 px-4">
                        {/* صورة المنتج */}
                        <img
                          src={
                            item.selectedImage ||
                            item.images?.[0] ||
                            '/placeholder.png'
                          }
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />

                        {/* تفاصيل المنتج */}
                        <div className="flex flex-col text-center sm:text-left">
                          <Link
                            to={`/product/${item.id}`}
                            state={{ product: item }}
                            className="text-gray-700 font-normal text-base hover:text-pink-800 hover:underline transition"
                          >
                            {item.name}
                          </Link>

                          {item.selectedColor && (
                            <span className="text-gray-500 text-sm mt-1">
                              color: {item.selectedColor.name}
                            </span>
                          )}

                          <p className="text-gray-400 text-sm mt-1">
                            {item.price.toFixed(2)} LE
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            size:
                            {item.selectedSize?.name || item.selectedSize}
                          </p>
                        </div>
                      </td>

                      {/* الكمية + حذف */}
                      <td className="text-center py-4">
                        <div className="flex items-center justify-center gap-4">
                          {/* التحكم في الكمية */}
                          <div className="flex items-center rounded-lg overflow-hidden bg-transparent border border-gray-200">
                            {/* + */}
                            <button
                              onClick={() =>
                                incrementQuantity(item.id, item.selectedSize)
                              }
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 transition"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>

                            {/* العدد */}
                            <div className="w-10 h-9 flex items-center justify-center text-gray-700 text-base font-normal">
                              {item.quantity}
                            </div>

                            {/* - */}
                            <button
                              onClick={() =>
                                decrementQuantity(item.id, item.selectedSize)
                              }
                              disabled={item.quantity === 1}
                              className={`w-9 h-9 flex items-center justify-center transition ${
                                item.quantity === 1
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* حذف */}
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.selectedSize)
                            }
                            className="text-gray-700 hover:text-black transition"
                            title="Remove"
                          >
                            <Trash2Icon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>

                      {/* الإجمالي */}
                      <td className="text-center text-gray-700 text-base font-normal">
                        {/* {(item.price * item.quantity).toFixed(2)} LE */}
                        {(item.price * item.quantity).toFixed(2)} LE
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div className="flex  justify-end">
            <CartPromotion />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
