import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
const colorMap = {
  Black_Obsidian_Onyx: '#353839',

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

export default function ProductRow({
  product,
  onEdit,
  onDelete,
  onOpenSlider,
}) {
  return (
    <tr className="hover:bg-pink-50 transition-colors duration-200">
      {/* الصور والألوان */}
      <td className="p-3 border text-center">
        <div className="flex flex-col items-center gap-2">
          {/* ✅ عرض الصور */}
          <div className="flex gap-2 flex-wrap justify-center mt-2">
            {(product.images || []).slice(0, 4).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg cursor-pointer border border-pink-200 hover:scale-105 transition-transform"
                onClick={() => onOpenSlider(product.images, idx)}
              />
            ))}

            {product.images?.length > 4 && (
              <button
                onClick={() => onOpenSlider(product.images)}
                className="text-xs text-pink-600 hover:underline"
              >
                +{product.images.length - 4} أخرى
              </button>
            )}
          </div>

          {/* ✅ عرض الألوان */}
          <div className="flex gap-2 flex-wrap justify-center mt-2">
            {(product.colors || []).slice(0, 4).map((c, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-xs"
                title={c.name}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-8 h-8 object-cover rounded-full border-2"
                  style={{ borderColor: colorMap[c.name] || '#fbb6ce' }}
                />
                <span className="text-pink-600">{c.name}</span>
              </div>
            ))}

            {/* ✅ لو عدد الألوان أكبر من 4 */}
            {product.colors?.length > 4 && (
              <button
                onClick={() => onOpenSlider(product.colors.map((c) => c.image))}
                className="text-xs text-pink-600 hover:underline"
              >
                +{product.colors.length - 4} ألوان أخرى
              </button>
            )}
          </div>
        </div>
      </td>

      {/* الاسم والسعر والوصف والتصنيف */}
      <td className="p-3 border font-medium text-pink-700">{product.name}</td>
      <td className="p-3 border text-pink-600 font-semibold">
        {product.price} LE
      </td>

      <td className="p-3 border text-pink-600">{product.category || '—'}</td>
      {/* الحالة */}
      <td className="p-3 border">
        {product.soldOut ? (
          <span className="text-red-600 font-semibold bg-red-100 px-2 py-1 rounded-md">
            نفد من المخزون
          </span>
        ) : (
          <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-md">
            متاح
          </span>
        )}
      </td>
      {/* أزرار التحكم */}
      <td className="p-3 border ">
        {/* زر التعديل */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
            title="تعديل"
          >
            <Edit className="w-5 h-5" />
          </button>

          {/* زر الحذف */}
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
            title="حذف"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
