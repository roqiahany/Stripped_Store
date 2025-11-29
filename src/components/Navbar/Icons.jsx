import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import UserIcon from './UserIcon';

const Icons = ({ setFilteredProducts }) => {
  const [showSearch, setShowSearch] = useState(false);
  const { cart } = useCart();

  return (
    <div className="flex items-center gap-4 relative">
      <div className="flex items-center gap-4">
        {/* باقي العناصر زي أيقونة الكارت أو البحث */}
        <UserIcon />
      </div>

      <Link to="/cart" className="relative">
        {/* <ShoppingCart className="w-6 h-6 text-gray-700" /> */}
        <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-700" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        )}
      </Link>
    </div>
  );
};

export default Icons;
