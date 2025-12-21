import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AccordionItem = ({ title, open, toggle, children }) => (
  <div className="border-b border-gray-200 mb-4">
    <button
      onClick={toggle}
      className="w-full flex justify-between items-center py-3 px-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      <span className="font-semibold text-gray-800">{title}</span>
      <svg
        className={`w-4 h-4 transition-transform ${
          open ? 'rotate-180' : 'rotate-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      className={`transition-all overflow-hidden ${
        open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="pb-4">{children}</div>
    </div>
  </div>
);

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
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (key) =>
    setActiveSection((prev) => (prev === key ? null : key));

  // Colors
  const colorOptions = [
    'Black_Obsidian_Onyx',
    'Blue_Chalcedony',
    'Onyx_Black',
    'Moonstone_Beige',
    'Sapphire_Blue',
    'Emerald_Green',
    'Midnight_Onyx',
    'Champagne_Quartz',
    'Blue_Chalcedony',
    'models',
    'packages',
  ];

  // Sizes
  // const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  // Categories
  const categoryOptions = ['T-Shirts', 'Hoodies', 'Pants', 'Jackets', 'Shoes'];

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleResetAll = () => {
    resetFilter();
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategory('');
  };

  // MAIN FILTER LOGIC
  useEffect(() => {
    let filtered = products;

    // PRICE
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || maxPrice;
    filtered = filtered.filter((p) => p.price >= minVal && p.price <= maxVal);

    // CATEGORY
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // SIZE  (Firestore → sizes = array)
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes?.some((sz) => selectedSizes.includes(sz))
      );
    }

    // COLOR (Firestore → colors = array of objects)
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors?.some((clr) => selectedColors.includes(clr.name))
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [min, max, selectedColors, selectedSizes, selectedCategory, products]);

  return (
    <aside className="w-full bg-white p-5 rounded-2xl shadow-lg border border-gray-200 font-['Inter']">
      {/* Reset */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleResetAll}
          className="text-pink-600 underline text-sm"
        >
          Reset all
        </button>
        <span className="text-gray-600 text-sm">Max price: {maxPrice} EGP</span>
      </div>

      {/* PRICE */}
      <AccordionItem
        title="Price"
        open={activeSection === 'price'}
        toggle={() => toggleSection('price')}
      >
        <div className="flex flex-col sm:flex-row gap-3 py-3">
          {/* From */}
          <div className="flex flex-col w-full sm:w-1/2 text-left">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="border rounded-md px-2 py-1 mt-1"
            />
          </div>

          {/* To */}
          <div className="flex flex-col w-full sm:w-1/2 text-left">
            <label className="text-sm text-gray-600">To</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="border rounded-md px-2 py-1 mt-1"
            />
          </div>
        </div>
      </AccordionItem>

      {/* CATEGORY */}
      <AccordionItem
        title="Category"
        open={activeSection === 'category'}
        toggle={() => toggleSection('category')}
      >
        <div className="flex flex-col gap-2 py-3">
          {categoryOptions.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </AccordionItem>

      {/* SIZE */}
      <AccordionItem
        title="Size"
        open={activeSection === 'size'}
        toggle={() => toggleSection('size')}
      >
        <div className="flex flex-wrap gap-2 py-3">
          {sizeOptions.map((sz) => (
            <button
              key={sz}
              onClick={() =>
                setSelectedSizes((prev) =>
                  prev.includes(sz)
                    ? prev.filter((s) => s !== sz)
                    : [...prev, sz]
                )
              }
              className={`px-3 py-1 rounded-md border text-sm ${
                selectedSizes.includes(sz)
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'border-gray-300'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </AccordionItem>

      {/* COLOR */}
      <AccordionItem
        title="Color"
        open={activeSection === 'color'}
        toggle={() => toggleSection('color')}
      >
        <div className="flex flex-wrap gap-3 py-3">
          {colorOptions.map((clr) => (
            <div
              key={clr}
              onClick={() =>
                setSelectedColors((prev) =>
                  prev.includes(clr)
                    ? prev.filter((c) => c !== clr)
                    : [...prev, clr]
                )
              }
              className={`w-7 h-7 rounded-full cursor-pointer border ${
                selectedColors.includes(clr)
                  ? 'ring-2 ring-pink-600'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: clr }}
            ></div>
          ))}
        </div>
      </AccordionItem>
    </aside>
  );
};

export default PriceFilterSidebar;
