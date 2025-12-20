import Cropper from 'react-easy-crop';

export default function CropperModal({
  show,
  imageToCrop,
  crop,
  zoom,
  setCrop,
  setZoom,
  handleCropComplete,
  saveCroppedImage,
  isUploadingColor,
  onClose,
}) {
  if (!show) return null;

  return (
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
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
