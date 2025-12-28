// export default function ProductColors({ colors, activeIndex, onSelect }) {
//   if (!colors?.length) return null;

//   return (
//     <div className="flex gap-3 mt-4">
//       {colors.map((color, index) => (
//         <button
//           key={index}
//           onClick={() => onSelect(color, index)}
//           className={`w-12 h-12 rounded-full border-2 overflow-hidden
//             ${
//               activeIndex === index
//                 ? 'border-pink-600 scale-110'
//                 : 'border-gray-300'
//             }`}
//         >
//           <img
//             src={color.image}
//             alt={color.name}
//             className="w-full h-full object-cover"
//           />
//         </button>
//       ))}
//     </div>
//   );
// }
