// import Slider from 'react-slick';
// import { NextArrow, PrevArrow } from './Arrows';

// export default function ProductImageSlider({
//   images,
//   sliderRef,
//   onImageClick,
// }) {
//   const settings = {
//     infinite: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   };

//   return (
//     <Slider ref={sliderRef} {...settings}>
//       {images.map((img, index) => (
//         <div key={index} className="flex justify-center">
//           <img
//             src={img}
//             className="max-h-[80vh] object-contain cursor-pointer"
//             onClick={() => onImageClick(img)}
//             alt=""
//           />
//         </div>
//       ))}
//     </Slider>
//   );
// }
