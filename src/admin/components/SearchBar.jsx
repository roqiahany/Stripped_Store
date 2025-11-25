import { useState, useMemo } from 'react';

export default function SearchBar({
  products,
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isFocused, setIsFocused] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory
        ? p.category === filterCategory
        : true;
      return matchSearch && matchCategory;
    });
  }, [products, search, filterCategory]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // لو عايزة تعرض اقتراحات حتى قبل الكتابة:
  const displayProducts = useMemo(() => {
    if (search) return paginatedProducts;
    return products.slice(0, 5);
  }, [search, paginatedProducts, products]);

  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi')); // تقسيم النص حسب البحث (غير حساس لحالة الأحرف)
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        placeholder="بحث عن منتج..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        className="text-pink-600 w-full border-2 border-pink-200 bg-pink-50 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-300 rounded-2xl py-2.5 pl-10 pr-4 placeholder-pink-400 shadow-sm outline-none"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {isFocused && displayProducts.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-pink-200 rounded-2xl shadow-lg overflow-hidden">
          {displayProducts.map((p) => {
            const imgSrc = p.image || (p.images && p.images[0]) || '';
            return (
              <div
                key={p.id}
                className="px-4 py-2 hover:bg-pink-50 cursor-pointer transition-colors flex items-center gap-3"
                onMouseDown={() => {
                  setSearch(p.name);
                  setIsFocused(false);
                }}
              >
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <span className="font-medium">
                    {highlightText(p.name, search)}
                  </span>
                  {p.price && (
                    <p className="text-sm text-gray-400">{p.price} LE</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFocused && displayProducts.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-pink-200 rounded-2xl shadow-lg px-4 py-2 text-gray-400">
          لا توجد نتائج
        </div>
      )}
    </div>
  );
}
