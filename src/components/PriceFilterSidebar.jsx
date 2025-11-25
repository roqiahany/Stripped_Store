import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const PriceFilterSidebar = ({
  min,
  max,
  setMin,
  setMax,
  products,
  setFilteredProducts,
  maxPrice,
  setCurrentPage,
  setShowFilter,
  resetFilter,
}) => {
  // أيقونة السهم (Dropdown)
  const DropdownIcon = () => (
    <svg
      className="w-4 h-4 transform transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  );

  // useEffect لتطبيق الفلترة مباشرة عند تغير min أو max
  useEffect(() => {
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || maxPrice;

    const filtered = products.filter(
      (p) => p.price >= minVal && p.price <= maxVal
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [min, max, products, maxPrice, setFilteredProducts, setCurrentPage]);

  return (
    <aside className="w-75 bg-white shadow-md rounded-xl p-4 font-['Inter'] relative border border-gray-200">
      {/* Reset + Highest Price */}
      <div className="flex justify-between items-center mb-3 flex-row-reverse">
        <button
          onClick={resetFilter}
          className="text-sm text-pink-600 underline hover:text-pink-700"
        >
          Reset all
        </button>
        <span className="text-sm text-gray-600">
          The highest price is {maxPrice} EGP
        </span>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-3"></div>

      {/* Price Section */}
      <div className="py-2">
        <div className="flex gap-4 ">
          {/* From */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 text-start">From:</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="0"
              className="border rounded-md px-2 py-1 w-28 text-sm"
            />
          </div>

          {/* To */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 text-start">To:</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder={maxPrice}
              className="border rounded-md px-2 py-1 w-28 text-sm"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PriceFilterSidebar;
