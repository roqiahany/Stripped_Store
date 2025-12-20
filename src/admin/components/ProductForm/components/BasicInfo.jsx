export default function BasicInfo({ form, setForm }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="اسم المنتج"
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="السعر"
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={form.soldOut || false}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, soldOut: e.target.checked }))
          }
        />
        <label className="text-gray-700 font-medium">
          المنتج غير متاح (Sold Out)
        </label>
      </div>
    </>
  );
}
