// مكوّن السهم
// السهام
const NextArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} bg-pink-500 hover:bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center z-10`}
    style={{ ...style }}
    onClick={onClick}
  >
    ›
  </div>
);

const PrevArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} bg-pink-500 hover:bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center z-10`}
    style={{ ...style }}
    onClick={onClick}
  >
    ‹
  </div>
);

export { NextArrow, PrevArrow };
