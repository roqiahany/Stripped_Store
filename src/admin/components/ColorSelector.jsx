import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const ColorSelector = ({ colors, selectedColor, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(selectedColor || null);

  // تزامن اللون الداخلي مع اللون القادم من الأب
  useEffect(() => {
    setSelected(selectedColor || null);
  }, [selectedColor]);

  const handleSelect = (color) => {
    setSelected(color);
    setOpen(false);
    if (onSelect) onSelect(color);
  };

  return (
    <div className="relative w-48 z-20 ">
      {/* الزر */}
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border-2 transition-all duration-300 shadow-sm ${
          open
            ? 'border-pink-400 bg-pink-100'
            : 'border-pink-200 bg-pink-50 hover:bg-pink-100'
        }`}
      >
        <span
          className={`font-medium transition-colors duration-300 ${
            open ? 'text-pink-700' : 'text-pink-600'
          }`}
        >
          {selected ? (
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border"
                style={{
                  backgroundColor: colorMap[selected] || selected.toLowerCase(),
                }}
              />
              {selected}
            </div>
          ) : (
            'اختر لون'
          )}
        </span>

        <ChevronDown
          className={`transition-transform duration-300 ${
            open ? 'rotate-180 text-pink-700' : 'rotate-0 text-pink-500'
          }`}
        />
      </button>

      {/* القائمة */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 bg-white border border-pink-200 rounded-2xl shadow-sm z-[9999] overflow-y-auto max-h-30 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100"
          >
            {colors.map((color, i) => (
              <li
                key={i}
                onClick={() => handleSelect(color)}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-pink-50 transition-all"
              >
                <span
                  className="w-5 h-5 rounded-full border"
                  style={{
                    backgroundColor: colorMap[color] || color.toLowerCase(),
                  }}
                />
                <span className="text-gray-700">{color}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// 🟢 خريطة الألوان (لو الأسماء بالعربي)
const colorMap = {
  Black_Obsidian_Onyx: '#353839',
  Blue_Chalcedony: '#A9C6C2',
  Onyx_Black: '#0B0B0B',
  Moonstone_Beige: '#D6C6B8',
  Sapphire_Blue: '#0F52BA',
  Emerald_Green: '#50C878',
  Midnight_Onyx: '#2C2F33',
  Champagne_Quartz: '#F7E7CE',
  Blue_Chalcedony: '#A9C6C2',
  models: '#808080',
  packages: '#FFD700',
};
export default ColorSelector;
