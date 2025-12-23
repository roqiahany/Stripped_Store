import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import BasicInfo from './components/BasicInfo';
import Description from './components/Description';
import CategorySection from './components/CategorySection';
import ImagesUploader from './components/ImagesUploader';
import ImagesPreview from './components/ImagesPreview';
import ColorsSection from './components/ColorsSection';
import CropperModal from './components/CropperModal';
import SubmitButton from './components/SubmitButton';

import getCroppedImg from './../cropImage';
import { db } from '../../../firebaseConfig';

export default function ProductForm({
  editingProduct,
  clearEditing,
  onProductSaved,
}) {
  const categories = [
    'Quarter-Zip Ribbed Pullover',
    'Hooded sherpa jacket',
    'Sherpa jacket',
    'Trending now',
  ];

  const colorOptions = [
    'Black_Obsidian_Onyx',

    'Onyx_Black',
    'Moonstone_Beige',
    'Sapphire_Blue',
    'Emerald_Green',
    'Midnight_Onyx',
    'Champagne_Quartz',
    'Blue_Chalcedony',
    'models',
    'packages',
  ];
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

  // =======================
  // 🔹 STATES
  // =======================
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
    category: '',
    colors: [],
    soldOut: false,
  });

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L', 'XL', 'XXL']);

  const [uploading, setUploading] = useState(false);
  const [uploadProgressMap, setUploadProgressMap] = useState({});
  const [colorName, setColorName] = useState('');
  const [colorFile, setColorFile] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [isUploadingColor, setIsUploadingColor] = useState(false);

  const [fileList, setFileList] = useState([]);

  // =======================
  // 🔹 EFFECT
  // =======================
  useEffect(() => {
    if (editingProduct) {
      setForm({ soldOut: false, ...editingProduct });
    }
  }, [editingProduct]);

  // =======================
  // 🔹 HANDLERS
  // =======================

  const handleColorImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (form.images.length + files.length > 45) {
      toast.error('الحد الأقصى للصور 45');
      return;
    }

    setFileList((prev) => [...prev, ...files]);

    for (const file of files) {
      try {
        setUploadProgressMap((p) => ({ ...p, [file.name]: 0 }));

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'Tarhty_Store');

        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dmtbsptpg/image/upload',
          data,
          {
            onUploadProgress: (e) => {
              const progress = Math.round((e.loaded * 100) / e.total);
              setUploadProgressMap((p) => ({ ...p, [file.name]: progress }));
            },
          }
        );

        setForm((prev) => ({
          ...prev,
          images: [...prev.images, res.data.secure_url],
        }));

        setUploadProgressMap((p) => ({ ...p, [file.name]: 100 }));
      } catch {
        setUploadProgressMap((p) => ({ ...p, [file.name]: -1 }));
        toast.error(`فشل رفع ${file.name}`);
      }
    }
  };

  const handleDeleteImage = (index) => {
    // حذف الصورة
    const updatedImages = form.images.filter((_, i) => i !== index);

    // حذف الألوان المرتبطة بالصورة
    let updatedColors = form.colors.filter((c) => c.imageIndex !== index);

    // إعادة ضبط imageIndex للألوان بعد الصورة المحذوفة
    updatedColors = updatedColors.map((c) =>
      c.imageIndex > index ? { ...c, imageIndex: c.imageIndex - 1 } : c
    );

    // حذف الملف الأصلي (للـ retry)
    const updatedFileList = fileList.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,
      images: updatedImages,
      colors: updatedColors,
    }));

    setFileList(updatedFileList);

    // ضبط الصورة المختارة
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex > index) {
      setSelectedImageIndex((prev) => prev - 1);
    }

    toast.success('تم حذف الصورة بنجاح');
  };

  const handleOpenCropper = () => {
    if (!colorName) return toast.error(' يرجى اختيار اسم اللون أولاً!');
    if (selectedImageIndex === null)
      return toast.error(' يرجى اختيار صورة للون!');

    setZoom(0.8); // 👈 مهم
    setCrop({ x: 0, y: 0 });
    setImageToCrop(
      colorFile
        ? URL.createObjectURL(colorFile)
        : form.images[selectedImageIndex]
    );
    setShowCropper(true);
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

  const handleCropComplete = (_, pixels) => setCroppedAreaPixels(pixels);

  const saveCroppedImage = async () => {
    if (!croppedAreaPixels || isUploadingColor) return;

    setIsUploadingColor(true);

    try {
      const cropped = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const blob = await (await fetch(cropped)).blob();

      const data = new FormData();
      data.append('file', blob);
      data.append('upload_preset', 'Tarhty_Store');

      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dmtbsptpg/image/upload',
        data,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            console.log('Uploading cropped image:', percent + '%');
          },
        }
      );

      setForm((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
          {
            name: colorName,
            image: res.data.secure_url,
            imageIndex: selectedImageIndex,
            sizes: sizeOptions.map((size) => ({
              name: size,
              available: true,
            })),
          },
        ],
      }));

      toast.success('تم رفع اللون بنجاح');
    } catch (err) {
      console.error(err);
      toast.error('فشل رفع اللون');
    } finally {
      setIsUploadingColor(false);
      setShowCropper(false);
      setColorName('');
      setSelectedImageIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ تحقق من الحقول الأساسية
    if (!form.name || !form.price || !form.images.length) {
      toast.error('يرجى ملء جميع البيانات');
      return;
    }

    // ✅ تحقق من وجود ألوان
    if (!form.colors.length) {
      toast.error('لازم تضيفي لون واحد على الأقل');
      return;
    }

    // ✅ تحقق من وجود مقاس واحد على الأقل لكل لون
    for (const color of form.colors) {
      const hasSize = color.sizes.some((s) => s.inStock || size.available);
      if (!hasSize) {
        toast.error(`اختاري مقاس واحد على الأقل للون ${color.name}`);
        return;
      }
    }

    const cleanedColors = form.colors.map((color) => ({
      ...color,
      sizes: color.sizes.filter((size) => size.inStock || size.available),
    }));

    // ✅ إضافة المنتج
    try {
      const finalForm = {
        ...form,
        colors: cleanedColors,
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), finalForm);
        clearEditing();
      } else {
        await addDoc(collection(db, 'products'), finalForm);
      }

      toast.success('تم الحفظ بنجاح');
      onProductSaved?.();

      setForm({
        name: '',
        price: '',
        description: '',
        images: [],
        category: '',
        colors: [],
        soldOut: false,
      });
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  // =======================
  // 🔹 JSX
  // =======================
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">إدارة المنتج</h2>
      <BasicInfo form={form} setForm={setForm} />
      <Description form={form} setForm={setForm} />
      <CategorySection
        categories={categories}
        value={form.category}
        onSelect={(cat) => setForm({ ...form, category: cat })}
      />
      <ImagesUploader
        form={form}
        fileList={fileList}
        uploadProgressMap={uploadProgressMap}
        handleColorImageUpload={handleColorImageUpload}
      />
      <ImagesPreview
        form={form}
        fileList={fileList}
        uploadProgressMap={uploadProgressMap}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
        handleDeleteImage={handleDeleteImage}
        retryUploadImage={retryUploadImage}
      />
      {/* <SizesSection colors={form.colors} setForm={setForm} /> */}
      <ColorsSection
        form={form}
        setForm={setForm}
        colorName={colorName}
        setColorName={setColorName}
        selectedImageIndex={selectedImageIndex}
        handleOpenCropper={handleOpenCropper}
        colorOptions={colorOptions}
        colorMap={colorMap}
        sizeOptions={sizeOptions}
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
      />

      <CropperModal
        show={showCropper}
        imageToCrop={imageToCrop}
        crop={crop}
        zoom={zoom}
        setCrop={setCrop}
        setZoom={setZoom}
        handleCropComplete={handleCropComplete}
        saveCroppedImage={saveCroppedImage}
        onClose={() => setShowCropper(false)}
        isUploadingColor={isUploadingColor}
      />
      <SubmitButton editingProduct={editingProduct} uploading={uploading} />
    </form>
  );
}
