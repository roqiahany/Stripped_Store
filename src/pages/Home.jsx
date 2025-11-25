import React from 'react';

import ImageBanner from '../components/heroImg';
import Products from './Products';

import AllProducts from './AllProducts';
import Footer from '../components/footer';
import Navbar from './../components/Navbar/Navbar';

export default function Home() {
  return (
    <>
      <div>
        <Navbar />
        <ImageBanner />{' '}
      </div>

      <AllProducts />

      <Footer />
    </>
  );
}
