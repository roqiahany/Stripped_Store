export default function SubmitButton({ editingProduct, uploading }) {
  return (
    <button
      type="submit"
      disabled={uploading}
      className="bg-pink-600 text-white px-6 py-3 rounded-xl w-full text-lg
        font-semibold disabled:opacity-50 shadow-md hover:bg-pink-700 transition"
    >
      {editingProduct ? 'تعديل المنتج' : 'إضافة المنتج'}
    </button>
  );
}
