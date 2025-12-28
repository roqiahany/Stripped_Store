// import Slider from 'react-slick';

// export default function ProductLightbox({ images, currentImage, onClose }) {
//   const initialIndex = images.indexOf(currentImage);

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
//       <button
//         onClick={onClose}
//         className="absolute top-6 right-6 text-white text-4xl"
//       >
//         ×
//       </button>

//       <Slider
//         infinite
//         initialSlide={initialIndex}
//         arrows
//         slidesToShow={1}
//         slidesToScroll={1}
//       >
//         {images.map((img, i) => (
//           <div key={i} className="flex justify-center">
//             <img
//               src={img}
//               className="max-h-[90vh] max-w-[90vw] object-contain"
//               alt=""
//             />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }
