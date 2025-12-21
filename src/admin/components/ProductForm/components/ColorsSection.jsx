import ColorSelector from '../../ColorSelector';

export default function ColorsSection({
  form,
  setForm,
  colorName,
  setColorName,
  selectedImageIndex,
  handleOpenCropper,
  colorOptions,
  colorMap = {},
  sizeOptions,
  selectedSizes,
  setSelectedSizes,
}) {
  return (
    <div className="border border-gray-200 p-5 rounded-xl bg-gray-50 space-y-4">
      <h3 className="font-semibold text-gray-600">الألوان المتاحة</h3>

      <div className="flex gap-4 flex-wrap">
        <ColorSelector
          colors={colorOptions}
          selectedColor={colorName}
          onSelect={setColorName}
        />

        <button
          type="button"
          disabled={!colorName || selectedImageIndex === null}
          onClick={handleOpenCropper}
          className="bg-pink-500 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          قص اللون
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {form.colors.map((color, colorIndex) => (
          <div
            key={colorIndex}
            className="relative flex flex-col items-center gap-3 border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* DELETE COLOR */}
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  colors: prev.colors.filter((_, idx) => idx !== colorIndex),
                }))
              }
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
            >
              ×
            </button>

            {/* COLOR IMAGE */}
            <img
              src={color.image}
              className="w-24 h-24 rounded-full border-4 object-cover"
              style={{ borderColor: colorMap?.[color.name] || '#ccc' }}
            />

            {/* COLOR NAME */}
            <p className="text-sm font-semibold capitalize">{color.name}</p>

            {/* SIZES */}
            {/* <div className="flex gap-2 flex-wrap justify-center">
              {color.sizes.map((size, sizeIndex) => (
                <button
                  key={sizeIndex}
                  type="button"
                  onClick={() =>
                    setForm((prev) => {
                      const updated = [...prev.colors];
                      updated[colorIndex].sizes[sizeIndex].inStock =
                        !updated[colorIndex].sizes[sizeIndex].inStock;
                      return { ...prev, colors: updated };
                    })
                  }
                  className={`px-4 py-1 rounded-full border text-sm transition
              ${
                size.inStock
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
                >
                  {size.name}
                </button>
              ))}
            </div> */}

            {/* SELECT SIZES */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-600">
                المقاسات المتاحة
              </p>

              <div className="flex gap-2 flex-wrap">
                {sizeOptions.map((size) => {
                  const isSelected = selectedSizes.includes(size);

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSizes((prev) =>
                          prev.includes(size)
                            ? prev.filter((s) => s !== size)
                            : [...prev, size]
                        )
                      }
                      className={`px-4 py-1 rounded-full border text-sm transition
            ${
              isSelected ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
            }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
