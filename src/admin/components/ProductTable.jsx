import { useState, useMemo } from 'react';
import SkeletonRow from './SkeletonRow';
import { useAdminProducts } from '../context/AdminProductsContext';
import ProductRow from './ProductRow';
import ImageSliderModal from './ImageSliderModal';
import ConfirmDialog from './ConfirmDialog';
import CategorySelector from './CategorySelector';
import SearchBar from './SearchBar';

export default function ProductTable({ onEdit }) {
  const { products, loading, deleteProduct } = useAdminProducts();

  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🆕 البحث و الفلترة
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory
        ? p.category.trim().toLowerCase() ===
          filterCategory.trim().toLowerCase()
        : true;
      return matchSearch && matchCategory;
    });
  }, [products, search, filterCategory]);

  // 🆕 الترقيم
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(deleteId);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف المنتج');
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const openSlider = (images) => {
    if (!images.length) return;
    setSelectedImages(images);
    setCurrentIndex(0);
    setShowModal(true);
  };

  const nextImage = () => {
    if (!selectedImages.length) return;
    setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    if (!selectedImages.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* 🔍 البحث و الفلترة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* مكون البحث  */}
        <SearchBar
          products={products}
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />

        {/* قائمة الفلترة */}
        <div className="relative w-full md:w-1/4">
          <CategorySelector
            categories={[...new Set(products.map((p) => p.category))]}
            onSelect={(cat) => setFilterCategory(cat)}
          />
        </div>
      </div>

      <table className="w-full mt-4 border-collapse border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <thead className="bg-pink-100">
          <tr>
            <th className="p-3 border-b border-gray-200">الصور</th>
            <th className="p-3 border-b border-gray-200">الاسم</th>
            <th className="p-3 border-b border-gray-200">السعر</th>
            <th className="p-3 border-b border-gray-200">التصنيف</th>{' '}
            <th className="p-3 border-b border-gray-200">الحالة</th>
            <th className="p-3 text-center border-b border-gray-200">التحكم</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : paginatedProducts.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                لا توجد منتجات
              </td>
            </tr>
          ) : (
            paginatedProducts.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                onEdit={onEdit}
                onDelete={askDelete}
                onOpenSlider={openSlider}
              />
            ))
          )}
        </tbody>
      </table>

      {/* 📑 أزرار الترقيم */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? 'bg-pink-600 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        message="هل أنت متأكد من حذف هذا المنتج؟"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {showModal && (
        <ImageSliderModal
          images={selectedImages}
          index={currentIndex}
          onPrev={prevImage}
          onNext={nextImage}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
