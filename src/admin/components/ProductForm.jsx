import { useEffect, useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios';
import ColorSelector from './ColorSelector';
import CategorySelectorPopup from './CategorySelectorPopup';
const categories = [
  'Original Linen',
  'Modal cotton (Ruffled modal)',
  'Printed modal',
  'Trending now',
  'Ruffled Cotton',
  'Glacé ( Italian dubitta )',
  'Miss chiffon',
  'Modal fabric',
  'Linen nest',
  'Scarfs and Shawls',
  'Bags',
  'Isdal',
  'Accessories',
];
const colorOptions = [
  'أحمر',
  'أزرق',
  'أصفر',
  'بنى',
  'بيج',
  'أخضر',
  'زهري',
  'أسود',
  'أبيض',
  'بنفسجى',
  'بيبى بلو',
  'بمبى',
  'مشجر',
  'نبيتي',
  'رمادي',
  'بني',
  'زيتي',
  'بيبي بلو',
  'بيبي بينك',
  'كحلي',
  'كشمير',
];

const colorMap = {
  أحمر: '#f87171',
  أزرق: '#60a5fa',
  أصفر: '#facc15',
  أخضر: '#34d399',
  زهري: '#f472b6',
  أسود: '#000000',
  أبيض: '#ffffff',
  بنفسجى: '#a78bfa',
  بنى: '#795548',
  بيج: '#dec3ae',
  بيبى_بلو: '#90b2d7',
  بمبى: '#cc9696',
  مشجر: 'linear-gradient(45deg, #f3ec78, #af4261)',
  نبيتي: '#6b4f4f',
  رمادي: '#9ca3af',
  بني: '#7c4a3a',
  زيتي: '#4a7c4a',
  بيبي_بلو: '#90b2d7',
  بيبي_بينك: '#f4c2d7',
  كحلي: '#1e3a8a',
  كشمير: '#d1b2c1',
};
export default function ProductForm({
  editingProduct,
  clearEditing,
  onProductSaved,
}) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
    category: '',
    colors: [],
    soldOut: false, // 🆕 الحقل الجديد
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState({}); // لكل صورة progress مستقل
  const [colorName, setColorName] = useState('');
  const [colorFile, setColorFile] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [uploadingColor, setUploadingColor] = useState(false);
  const [croppedImagePreview, setCroppedImagePreview] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [isUploadingColor, setIsUploadingColor] = useState(false);

  const [fileList, setFileList] = useState([]); // لتخزين الملفات الأصلية للretry

  useEffect(() => {
    if (editingProduct) setForm({ soldOut: false, ...editingProduct });
  }, [editingProduct]);

  const handleColorImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // منع رفع أكتر من 45 صورة
    if (form.images.length + files.length > 45) {
      toast.error(' الحد الأقصى للصور 45');
      return;
    }

    setFileList((prev) => [...prev, ...files]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Tarhty_Store');

      try {
        // نبدأ التحميل
        setUploadProgressMap((prev) => ({ ...prev, [file.name]: 0 }));

        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dmtbsptpg/image/upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgressMap((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            },
          }
        );

        const imageUrl = res.data.secure_url;

        // ✅ تخزين الصورة كـ URL مش base64
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));

        setUploadProgressMap((prev) => ({ ...prev, [file.name]: 100 }));
        toast.success(' تم رفع الصورة بنجاح');
      } catch (err) {
        console.error(err);
        setUploadProgressMap((prev) => ({ ...prev, [file.name]: -1 }));
        toast.error(` فشل رفع ${file.name}`);
      }
    }

    // تصفير الحقول المؤقتة
    setColorName('');
    setColorFile(null);
    setSelectedImageIndex(null);
  };

  const retryUploadImage = async (idx) => {
    const file = fileList[idx];
    if (!file) return;
    setUploadProgressMap((prev) => ({ ...prev, [file.name]: 0 }));

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'Tarhty_Store');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dmtbsptpg/image/upload`,
        { method: 'POST', body: data }
      );
      const result = await res.json();

      setForm((prev) => ({
        ...prev,
        images: prev.images.map((img, i) =>
          i === idx ? result.secure_url : img
        ),
      }));
      setUploadProgressMap((prev) => ({ ...prev, [file.name]: 100 }));
      toast.success('تم رفع الصورة بنجاح');
    } catch {
      setUploadProgressMap((prev) => ({ ...prev, [file.name]: -1 }));
      toast.error('فشل إعادة رفع الصورة');
    }
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      colors: prev.colors.filter((c) => c.imageIndex !== index),
    }));
  };

  const handleAddColor = async () => {
    if (!colorName || selectedImageIndex === null)
      return toast.error('اختر اسم اللون والصورة أولاً');

    if (form.colors.some((c) => c.imageIndex === selectedImageIndex))
      return toast.error(' هذه الصورة لها لون بالفعل!');

    setUploadingColor(true);
    try {
      let uploadedUrl = '';
      if (colorFile) {
        const data = new FormData();
        data.append('file', colorFile);
        data.append('upload_preset', 'Tarhty_Store');
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dmtbsptpg/image/upload`,
          { method: 'POST', body: data }
        );
        const result = await res.json();
        uploadedUrl = result.secure_url;
      }

      setForm((prev) => ({
        ...prev,
        colors: [
          ...(prev.colors || []),
          {
            name: colorName,
            image: uploadedUrl || prev.images[selectedImageIndex],
            imageIndex: selectedImageIndex,
          },
        ],
      }));

      setColorName('');
      setColorFile(null);
      setSelectedImageIndex(null);
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء رفع اللون');
    } finally {
      setUploadingColor(false);
    }
  };

  const handleCropComplete = (_, croppedAreaPixels) =>
    setCroppedAreaPixels(croppedAreaPixels);

  const saveCroppedImage = async () => {
    if (!croppedAreaPixels || isUploadingColor) return; // 🔒 منع الضغط المتكرر

    setIsUploadingColor(true); // ⏳ نبدأ التحميل

    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);

      // نحول Base64 → Blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, `${colorName || 'color'}.jpg`);
      formData.append('upload_preset', 'Tarhty_Store');

      // رفع الصورة على Cloudinary
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dmtbsptpg/image/upload',
        formData
      );

      const imageUrl = res.data.secure_url;

      // تحديث الـ form
      setForm((prev) => ({
        ...prev,
        colors: [
          ...(prev.colors || []),
          {
            name: colorName,
            image: imageUrl,
            imageIndex: selectedImageIndex,
          },
        ],
      }));

      toast.success(' تم رفع الصورة بنجاح');
    } catch (err) {
      console.error(err);
      toast.error(' حدث خطأ أثناء رفع الصورة');
    } finally {
      // ✅ نرجع الزرار يشتغل تاني بعد الرفع
      setIsUploadingColor(false);

      setShowCropper(false);
      setColorName('');
      setColorFile(null);
      setImageToCrop(null);
      setCroppedAreaPixels(null);
      setSelectedImageIndex(null);
    }
  };

  const handleOpenCropper = () => {
    if (!colorName) return toast.error(' يرجى اختيار اسم اللون أولاً!');
    if (selectedImageIndex === null)
      return toast.error(' يرجى اختيار صورة للون!');
    setImageToCrop(
      colorFile
        ? URL.createObjectURL(colorFile)
        : form.images[selectedImageIndex]
    );
    setShowCropper(true);
  };

  const handleDeleteImage = (index) => {
    // حذف الصورة من images
    const updatedImages = form.images.filter((_, i) => i !== index);

    // حذف الألوان المرتبطة بنفس الصورة
    let updatedColors = form.colors.filter((c) => c.imageIndex !== index);

    // تحديث الـ imageIndex لكل الألوان اللي كانت بعد الصورة المحذوفة
    updatedColors = updatedColors.map((c) =>
      c.imageIndex > index ? { ...c, imageIndex: c.imageIndex - 1 } : c
    );

    // حذف من fileList لو بتستخدميه
    const updatedFileList = fileList.filter((_, i) => i !== index);

    // تحديث الحالة العامة
    setForm((prev) => ({
      ...prev,
      images: updatedImages,
      colors: updatedColors,
    }));
    setFileList(updatedFileList);

    // في حال كانت الصورة المحذوفة مختارة
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex > index) {
      setSelectedImageIndex((prev) => prev - 1);
    }

    toast.success('تم حذف الصورة واللون المرتبط بها بنجاح');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    if (!form.name) errors.push('الاسم مطلوب');
    if (!form.price) errors.push('السعر مطلوب');
    if (!form.description) errors.push('الوصف مطلوب');
    if (!form.images.length) errors.push('يرجى رفع صورة واحدة على الأقل');
    if (!form.category) errors.push('اختر التصنيف');
    if (!form.colors.length) errors.push('يرجى إضافة لون واحد على الأقل');

    // ✅ تحقق أن كل صورة ليها لون
    const imageIndexesWithColors = form.colors.map((c) => c.imageIndex);
    const imagesWithoutColors = form.images
      .map((_, idx) => idx)
      .filter((idx) => !imageIndexesWithColors.includes(idx));

    if (imagesWithoutColors.length > 0) {
      errors.push('يرجى إضافة لون لكل صورة منتج');
    }

    if (errors.length) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      if (editingProduct) {
        const ref = doc(db, 'products', editingProduct.id);
        await updateDoc(ref, form);
        clearEditing();
      } else {
        await addDoc(collection(db, 'products'), form);
      }

      // 🧹 تفريغ جميع الحقول و الحالات المرتبطة
      setForm({
        name: '',
        price: '',
        description: '',
        images: [],
        category: '',
        colors: [],
      });
      setFileList([]); // إفراغ الملفات
      setSelectedImageIndex(null); // إلغاء تحديد الصورة المختارة
      setUploadProgressMap({}); // إعادة تعيين نسب الرفع
      setColorName(''); // إعادة تعيين اسم اللون
      setShowCropper(false); // إخفاء الكروبر إن كان مفتوح

      toast.success('تم الحفظ بنجاح ✨');
      onProductSaved?.();

      window.scrollTo({ top: 0, behavior: 'smooth' }); // 🔝 يرجع لأعلى يشوف التوست
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <form onSubmit={handleSubmit} className="mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">إدارة المنتج</h2>

        {/* الحقول الأساسية */}
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
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="soldOut"
            checked={form.soldOut || false}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, soldOut: e.target.checked }))
            }
          />
          <label htmlFor="soldOut" className="text-gray-700 font-medium">
            المنتج غير متاح (Sold Out)
          </label>
        </div>

        <textarea
          placeholder="الوصف"
          className="w-full h-32 resize-none border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <CategorySelectorPopup
          categories={categories}
          value={form.category}
          onSelect={(cat) => setForm({ ...form, category: cat })}
        />

        {/* رفع الصور */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label
            htmlFor="product-images"
            className="block w-full text-center cursor-pointer border border-dashed border-pink-300 p-4 rounded-xl text-pink-500 hover:bg-pink-50 transition"
          >
            ارفع صور المنتج
          </label>

          <input
            id="product-images"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleColorImageUpload}
            onClick={(e) => {
              if (form.images.length >= 45) {
                e.preventDefault();
                toast.error(' لا يمكنك إضافة أكثر من 45 صورة  ');
              } else e.target.value = null;
            }}
          />

          <p className="text-sm text-gray-500 mt-2">
            الصور المرفوعة: {form.images.length} / 45
          </p>

          {/* progress لكل صورة */}
          <div className="mt-4 my-3 space-y-3">
            {fileList.map((file) => {
              const progress = uploadProgressMap[file.name] || 0;
              const isFailed = progress === -1;

              if (progress === 100 && !isFailed) return null;

              return (
                <div key={file.name} className="relative w-full">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isFailed ? 'bg-red-400' : 'bg-pink-300'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="absolute right-1 top-[-18px] text-xs text-gray-500">
                    {isFailed ? 'فشل' : `${progress}%`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* عرض الصور */}
          {form.images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-4">
              {form.images.map((img, idx) => {
                const hasColor = form.colors.some((c) => c.imageIndex === idx);
                const progress = uploadProgressMap[fileList[idx]?.name];
                const isSelected = selectedImageIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`relative w-28 h-28 rounded-xl overflow-hidden shadow-sm bg-white border-2 transition-all ${
                      isSelected ? 'border-pink-500' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      if (hasColor) {
                        toast.error(' هذه الصورة لها لون بالفعل!');
                        return;
                      }
                      setSelectedImageIndex(isSelected ? null : idx);
                    }}
                  >
                    <img
                      src={img}
                      alt={`صورة #${idx + 1}`}
                      className={`w-full h-full object-cover cursor-pointer transition-transform duration-200 ${
                        isSelected ? 'scale-105' : 'hover:scale-105'
                      } ${hasColor ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />

                    {/* زر حذف الصورة */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // منع التداخل مع الاختيار
                        handleDeleteImage(idx);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full shadow hover:bg-red-600 transition"
                      title="حذف الصورة"
                    >
                      ✕
                    </button>

                    {/* الشريط السفلي أثناء التحميل */}
                    {progress >= 0 && progress < 100 && (
                      <div className="absolute bottom-0 left-0 w-full h-6 bg-gray-200 rounded-b-lg flex items-center justify-center">
                        <div
                          className="absolute left-0 top-0 h-full bg-pink-500 rounded"
                          style={{ width: `${progress}%` }}
                        ></div>
                        <span className="relative text-white text-sm font-bold">
                          {progress}%
                        </span>
                      </div>
                    )}

                    {progress === -1 && (
                      <button
                        className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded"
                        onClick={() => retryUploadImage(idx)}
                      >
                        إعادة رفع
                      </button>
                    )}

                    {hasColor && (
                      <span className="absolute bottom-1 left-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded">
                        لون موجود
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* الألوان */}
        <div className="border border-gray-200 p-5 rounded-xl bg-gray-50 space-y-4">
          <h3 className="font-semibold text-gray-600">الألوان المتاحة</h3>
          <div className="flex flex-wrap items-center justify-start gap-4">
            {/* اختيار اللون */}
            <ColorSelector
              colors={colorOptions}
              selectedColor={colorName}
              onSelect={(color) => setColorName(color)}
            />

            {/* زر قص اللون */}
            <button
              type="button"
              disabled={!colorName || selectedImageIndex === null}
              onClick={handleOpenCropper}
              className="bg-pink-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm 
               hover:bg-pink-600 disabled:opacity-50 transition-all duration-200 
               whitespace-nowrap"
            >
              قص اللون
            </button>
          </div>

          <div className="flex gap-3 flex-wrap mt-2">
            {form.colors.map((c, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center group"
                title={`اللون: ${c.name}\nالصورة: #${c.imageIndex + 1}`}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-24 h-24 object-cover rounded-full border-4 shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ borderColor: colorMap[c.name] || '#ccc' }}
                />
                <p className="text-center text-sm mt-1 text-gray-600">
                  {c.name}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      colors: prev.colors.filter((_, idx2) => idx2 !== i),
                    }))
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cropper */}
        {showCropper && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-[400px] h-[420px] flex flex-col shadow-lg">
              <div className="flex-1 relative rounded-xl overflow-hidden border">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={saveCroppedImage}
                  disabled={isUploadingColor}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    isUploadingColor
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isUploadingColor ? 'جاري الرفع...' : 'حفظ الصورة المقصوصة'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCropper(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl w-full text-lg
           font-semibold disabled:opacity-50 shadow-md hover:bg-pink-700 transition"
        >
          {editingProduct ? 'تعديل المنتج' : 'إضافة المنتج'}
        </button>
      </form>
    </>
  );
}
