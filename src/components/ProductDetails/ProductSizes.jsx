// export default function ProductSizes({ sizes, selectedSize, onSelect }) {
//   if (!sizes?.length) return null;

//   return (
//     <div className="flex gap-2 flex-wrap">
//       {sizes.map((size, i) => {
//         const disabled = size.available === false || size.inStock === false;

//         return (
//           <button
//             key={i}
//             disabled={disabled}
//             onClick={() => onSelect(size)}
//             className={`px-4 py-2 rounded-lg border
//               ${
//                 disabled
//                   ? 'bg-gray-200 text-gray-400'
//                   : selectedSize?.name === size.name
//                   ? 'border-pink-600 bg-pink-50'
//                   : 'border-gray-300'
//               }`}
//           >
//             {size.name}
//           </button>
//         );
//       })}
//     </div>
//   );
// }
