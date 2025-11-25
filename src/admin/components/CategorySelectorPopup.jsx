import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CategorySelectorPopup({ categories, value, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* الزر الأساسي */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-gray-300 bg-gray-50 px-4 py-3 rounded-xl 
                   hover:border-pink-400 focus:ring-2 focus:ring-pink-300 outline-none transition-all"
      >
        <span className="text-gray-700 font-medium">
          {value || 'اختر التصنيف'}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            open ? 'rotate-180 text-pink-500' : ''
          }`}
        />
      </button>

      {/* القائمة المنسدلة */}
      {open && (
        <div
          className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg 
                     z-20 max-h-60 overflow-y-auto animate-fadeIn"
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  onSelect(cat);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer transition-all ${
                  value === cat
                    ? 'bg-pink-100 text-pink-700 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                {cat}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">
              لا توجد تصنيفات متاحة
            </div>
          )}
        </div>
      )}
    </div>
  );
}
