import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const CategorySelector = ({ categories, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (cat) => {
    setSelected(cat);
    setOpen(false);
    if (onSelect) onSelect(cat);
    console.log(cat);
  };

  return (
    <div>
      {/* الزر الرئيسي */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border-2 transition-all duration-300 shadow-sm
    ${
      open
        ? 'border-pink-400 bg-pink-100'
        : 'border-pink-200 bg-pink-50 hover:bg-pink-100'
    }
  `}
      >
        <span
          className={`font-medium transition-colors duration-300 ${
            open ? 'text-pink-700' : 'text-pink-600'
          }`}
        >
          {selected ? selected : 'All Categories'}
        </span>

        <ChevronDown
          className={`transition-transform duration-300 ${
            open ? 'rotate-180 text-pink-700' : 'rotate-0 text-pink-500'
          }`}
        />
      </button>
      {/* القائمة المنسدلة */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 bg-white border border-pink-200 rounded-2xl shadow-sm z-10 overflow-hidden"
          >
            <li
              onClick={() => handleSelect(null)}
              className={`px-4 py-2 cursor-pointer transition-all rounded-2xl ${
                selected === null
                  ? 'bg-pink-50 text-pink-700'
                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              All Categories
            </li>
            {categories.map((cat, index) => (
              <li
                key={index}
                onClick={() => handleSelect(cat)}
                className={`px-4 py-2 cursor-pointer transition-all rounded-2xl ${
                  selected === cat
                    ? 'bg-pink-50 text-pink-700'
                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                {cat}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySelector;
