import toast from 'react-hot-toast';

export default function ImagesUploader({
  form,
  fileList,
  uploadProgressMap,
  handleColorImageUpload,
}) {
  return (
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
            toast.error('لا يمكنك إضافة أكثر من 45 صورة');
          } else e.target.value = null;
        }}
      />

      <p className="text-sm text-gray-500 mt-2">
        الصور المرفوعة: {form.images.length} / 45
      </p>

      <div className="mt-4 space-y-3">
        {fileList.map((file) => {
          const progress = uploadProgressMap[file.name] || 0;
          const isFailed = progress === -1;
          if (progress === 100 && !isFailed) return null;

          return (
            <div key={file.name} className="relative w-full">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    isFailed ? 'bg-red-400' : 'bg-pink-300'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="absolute right-1 top-[-18px] text-xs">
                {isFailed ? 'فشل' : `${progress}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
