import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiTag } from 'react-icons/hi';
const CartPromotion = () => {
  const navigate = useNavigate();
  const { cart, clearCart, applyPromoCode, promo } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  const total = cart.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.quantity,
    0
  );

  const handleApply = () => {
    const success = applyPromoCode(promoCode.toUpperCase().trim());
    if (!success) setError('Invalid promo code');
    else setError('');
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* Promo Code */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm max-w-md">
        <div className="flex items-center gap-2 mb-3">
          <HiTag className="text-pink-600" />
          <span className="font-semibold">Promotional Code</span>
        </div>

        <div className="flex gap-2">
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 border rounded px-3 py-2"
          />
          {promo?.code && (
            <p className="text-green-600 text-sm mt-2">
              Promo code <b>{promo.code}</b> applied ({promo.discount}% off)
            </p>
          )}

          <button
            onClick={handleApply}
            className="bg-pink-600 text-white px-4 rounded"
          >
            Apply
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Total */}
      <h2 className="text-lg">
        Estimated total
        <span className="text-pink-600 ml-4">{total.toFixed(2)} EGP</span>
      </h2>

      <button
        onClick={() => navigate('/Checkout')}
        className="bg-pink-600 text-white py-3 rounded-lg"
      >
        Checkout
      </button>

      <button onClick={clearCart} className="border py-3 rounded-lg">
        Empty Cart
      </button>
    </div>
  );
};

export default CartPromotion;
