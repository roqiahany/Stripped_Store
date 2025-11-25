export default function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.crossOrigin = 'anonymous'; // ✅ مهم جدًا
  image.src = imageSrc;

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  return new Promise((resolve, reject) => {
    image.onload = () => {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      resolve(canvas.toDataURL('image/jpeg')); // ترجع صورة base64
    };
    image.onerror = (error) => reject(error);
  });
}
