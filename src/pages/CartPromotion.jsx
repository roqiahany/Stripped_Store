import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiTag } from 'react-icons/hi';
const CartPromotion = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [finalPrices, setFinalPrices] = useState(
    cart.map((item) => item.price)
  );

  // كودات الخصم
  const promoCodes = {
    SAVE10: 10, // 10% خصم
    SAVE20: 20,
    VIP30: 30,
  };

  const total = finalPrices.reduce(
    (sum, price, idx) => sum + price * cart[idx].quantity,
    0
  );

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim();
    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);

      // تحديث finalPrices
      const updatedPrices = cart.map(
        (item) => item.price * (1 - promoCodes[code] / 100)
      );
      setFinalPrices(updatedPrices);
      setError('');
    } else {
      setDiscount(0);
      setFinalPrices(cart.map((item) => item.price));
      setError('Invalid promo code');
    }
  };

  // لو اتغير الكارت اعادة الحساب بدون خصم
  useEffect(() => {
    if (discount === 0) {
      setFinalPrices(cart.map((item) => item.price));
    } else {
      const updatedPrices = cart.map(
        (item) => item.price * (1 - discount / 100)
      );
      setFinalPrices(updatedPrices);
    }
  }, [cart]);

  return (
    <div
      className="flex flex-col justify-between items-end md:items-center mt-8 pt-6 gap-6 w-100"
      dir="ltr"
    >
      {/* ======== Promo Code Section ======== */}
      <div className="cart__promotion bg-gray-50 p-4 rounded-lg shadow-sm w-full md:max-w-md">
        <div className="promotion__header flex items-center gap-2 mb-3">
          <HiTag className="w-5 h-5 text-pink-600" />
          <span className="font-semibold text-gray-700 text-lg">
            Promotional Code
          </span>
        </div>

        <div className="promotion__form flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter Promotional code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button
            type="button"
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
            onClick={applyPromoCode}
          >
            Apply
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {discount > 0 && (
          <p className="text-green-600 font-semibold mt-2">
            Discount applied: {discount}% off. Final Price: {total.toFixed(2)}{' '}
            EGP
          </p>
        )}
      </div>

      {/* ======== Total & Buttons ======== */}
      <div className="flex flex-col items-start gap-4 mt-4 md:mt-0 w-full md:w-auto">
        <h2 className="text-lg font-normal">
          Estimated total
          <span className="text-pink-600 ml-5">{total.toFixed(2)} EGP</span>
        </h2>

        <button
          onClick={() => navigate('/Checkout')}
          className="bg-pink-600 text-white px-10 py-3 rounded-lg hover:bg-pink-700 transition w-full  text-center"
        >
          Checkout
        </button>

        <button
          onClick={clearCart}
          className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700 w-full  text-center"
        >
          Empty Cart
        </button>
      </div>
    </div>
  );
};

export default CartPromotion;
