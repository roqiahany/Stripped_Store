import toast from 'react-hot-toast';

export default function ImagesPreview({
  form,
  fileList,
  uploadProgressMap,
  selectedImageIndex,
  setSelectedImageIndex,
  handleDeleteImage,
  retryUploadImage,
}) {
  if (!form.images.length) return null;

  return (
    <div className="flex gap-3 flex-wrap mt-4">
      {form.images.map((img, idx) => {
        const hasColor = form.colors.some((c) => c.imageIndex === idx);
        const progress =
          fileList?.[idx] && uploadProgressMap
            ? uploadProgressMap[fileList[idx].name]
            : undefined;

        const isSelected = selectedImageIndex === idx;

        return (
          <div
            key={idx}
            className={`relative w-28 h-28 rounded-xl overflow-hidden border-2 ${
              isSelected ? 'border-pink-500' : 'border-gray-200'
            }`}
            onClick={() => {
              if (hasColor) {
                toast.error('هذه الصورة لها لون بالفعل!');
                return;
              }
              setSelectedImageIndex(isSelected ? null : idx);
            }}
          >
            <img
              src={img}
              className={`w-full h-full object-cover ${
                hasColor ? 'opacity-50' : ''
              }`}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(idx);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full"
            >
              ✕
            </button>

            {progress === -1 && (
              <button
                onClick={() => retryUploadImage(idx)}
                className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded"
              >
                إعادة رفع
              </button>
            )}

            {hasColor && (
              <span className="absolute bottom-1 left-1 bg-pink-500 text-white text-xs px-2 rounded">
                لون موجود
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
