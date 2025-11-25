// cloudinaryUpload.js
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_URL,
} from '../cloudinaryConfig';
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  try {
    const res = await fetch(CLOUDINARY_API_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error('Upload failed:', err);
    return null;
  }
};

export default uploadToCloudinary;
