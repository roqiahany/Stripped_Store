// export default function getCroppedImg(imageSrc, pixelCrop) {
//   const image = new Image();
//   image.crossOrigin = 'anonymous'; // ✅ مهم جدًا
//   image.src = imageSrc;

//   const canvas = document.createElement('canvas');
//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;
//   const ctx = canvas.getContext('2d');

//   return new Promise((resolve, reject) => {
//     image.onload = () => {
//       ctx.drawImage(
//         image,
//         pixelCrop.x,
//         pixelCrop.y,
//         pixelCrop.width,
//         pixelCrop.height,
//         0,
//         0,
//         pixelCrop.width,
//         pixelCrop.height
//       );
//       resolve(canvas.toDataURL('image/jpeg')); // ترجع صورة base64
//     };
//     image.onerror = (error) => reject(error);
//   });
// }

export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  background = 'white'
) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });

  // ✨ حدد الحد الأقصى للأبعاد لتقليل الحجم
  const maxDim = 1000;
  const scale = Math.min(
    maxDim / pixelCrop.width,
    maxDim / pixelCrop.height,
    1
  );

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width * scale;
  canvas.height = pixelCrop.height * scale;
  const ctx = canvas.getContext('2d');

  // املأ الخلفية
  if (background === 'transparent') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ارسم الصورة
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png'); // PNG يحافظ على الشفافية أو خلفية بيضاء
  });
}
