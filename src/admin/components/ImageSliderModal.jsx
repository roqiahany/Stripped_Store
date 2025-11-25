import React from 'react';

export default function ImageSliderModal({
  images,
  index,
  onPrev,
  onNext,
  onClose,
}) {
  if (!images || !images.length) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <div className="flex items-center justify-center">
          <button
            onClick={onPrev}
            className="px-2 text-xl text-gray-700 hover:text-black"
          >
            ‹
          </button>

          <img
            src={images[index]}
            alt=""
            className="max-h-96 object-contain mx-4"
          />

          <button
            onClick={onNext}
            className="px-2 text-xl text-gray-700 hover:text-black"
          >
            ›
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-2">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
