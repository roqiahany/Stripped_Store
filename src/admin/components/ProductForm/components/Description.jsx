export default function Description({ form, setForm }) {
  return (
    <textarea
      placeholder="الوصف"
      className="w-full h-32 resize-none border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
    />
  );
}
