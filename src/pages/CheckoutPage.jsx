import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

import { User, ShoppingCart, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.finalPrice  * item.quantity,
    0
  );


  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleNext = () => {
    if (step === 1) {
      if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      // رقم موبايل مصري
      const phoneRegex = /^(01)[0-9]{9}$/;
      if (!phoneRegex.test(form.phone)) {
        alert('Please enter a valid Egyptian phone number');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const steps = [
    { id: 1, label: 'Your Details', icon: User },
    { id: 2, label: 'Order Summary', icon: ShoppingCart },
    { id: 3, label: 'Success', icon: CheckCircle },
  ];
  const handleConfirm = () => {
    let message = `🟣 *New Order*\n\n👤 *Customer Details*\n`;
    message += `Name: ${form.name}\n`;
    message += `Phone: ${form.phone}\n`;

    message += `Address: ${form.address}\n`;
    message += `Notes: ${form.notes || 'None'}\n\n`;

    message += `🛍 *Products*\n`;
    cart.forEach((item, i) => {
      const image =
        item.selectedImage || item.image || item.images?.[0] || 'No Image';

      message += `\n${i + 1}. ${item.name}\n`;
      message += `Color: ${item.selectedColor?.name || '—'}\n`;
      message += `Quantity: ${item.quantity}\n`;
      message += `Price: ${item.finalPrice } EGP\n`;
      message += `Image: ${image}\n`;
    });

    message += `\n💰 *Total*: ${total} EGP`;

    const phone = '+201117194095';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    clearCart();
    setStep(3);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-white max-w-3xl mx-auto">
        {/* ====== STEPS HEADER ====== */}

        {/* Progress Bar */}
        <div className="relative mb-8" dir="ltr">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -translate-y-1/2"></div>
          <motion.div
            className="absolute top-1/2 left-0 h-1 bg-pink-600 -translate-y-1/2"
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>

          <div className="flex justify-between relative z-10 mt-1">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.id}
                  className="flex flex-col items-center flex-1 cursor-default"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: step >= s.id ? 1.2 : 1,
                    color: step >= s.id ? '#db2777' : '#9ca3af',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-md transition-all duration-500 ease-in-out ${
                      step >= s.id
                        ? 'bg-pink-600 border-pink-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-2 text-xs text-center font-semibold transition-colors duration-500 ${
                      step >= s.id ? 'text-pink-600' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ====== STEPS CONTENT ====== */}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
              dir="ltr"
            >
              <h2 className="text-xl font-semibold text-start">
                {' '}
                your details
              </h2>

              <input
                type="text"
                placeholder="full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <textarea
                placeholder="additional notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <button
                onClick={handleNext}
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* STEP 2 — ORDER SUMMARY */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold"> order summary</h2>

              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={
                      item.selectedImage ||
                      item.image ||
                      item.images?.[0] ||
                      '/placeholder.png'
                    }
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.selectedColor && (
                      <p className="text-gray-600 text-sm">
                        color: {item.selectedColor.name}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm">
                      quantity: {item.quantity}
                    </p>
                    <p className="font-bold mt-1">
                      {(
                        (item.finalPrice ) * item.quantity
                      ).toFixed(2)}{' '}
                      EGP
                    </p>
                  </div>
                </div>
              ))}

              <h3 className="text-lg font-bold">
                total: <span className="text-pink-600">{total} EGP</span>
              </h3>

              <button
                onClick={handleConfirm}
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
              >
                Confirm Order
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full border py-3 rounded-lg"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* STEP 3 — SUCCESS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20"
              dir="ltr"
            >
              <h2 className="text-2xl font-bold text-pink-600">
                ✔ Your Order Has Been Confirmed!
              </h2>
              <p className="mt-4 text-gray-600">
                We will contact you within minutes on WhatsApp .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}
