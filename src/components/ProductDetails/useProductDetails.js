// import { useEffect, useState } from 'react';
// import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
// import { db } from '../../firebaseConfig';

// export function useProductDetails(id) {
//   const [product, setProduct] = useState(null);
//   const [recommendedProducts, setRecommendedProducts] = useState([]);
//   const [loadingProduct, setLoadingProduct] = useState(true);
//   const [loadingRecommended, setLoadingRecommended] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoadingProduct(true);
//         const snap = await getDoc(doc(db, 'products', id));
//         if (snap.exists()) {
//           setProduct({ id: snap.id, ...snap.data() });
//         } else {
//           setProduct(null);
//         }
//       } catch (e) {
//         console.error(e);
//         setProduct(null);
//       } finally {
//         setLoadingProduct(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     if (!product) return;

//     const fetchRecommended = async () => {
//       try {
//         setLoadingRecommended(true);
//         const qs = await getDocs(collection(db, 'products'));
//         const all = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
//         setRecommendedProducts(
//           all.filter((p) => p.id !== product.id).slice(0, 4)
//         );
//       } catch (e) {
//         console.error(e);
//         setRecommendedProducts([]);
//       } finally {
//         setLoadingRecommended(false);
//       }
//     };

//     fetchRecommended();
//   }, [product]);

//   return {
//     product,
//     recommendedProducts,
//     loadingProduct,
//     loadingRecommended,
//   };
// }
