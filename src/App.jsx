import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from '@admin/pages/AdminDashboard';
import PrivateRoute from '@components/PrivateRoute';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@theme';
import AdminProfile from '@pages/AdminProfile';
import { Toaster } from 'react-hot-toast';
import Home from '@pages/Home';
import TrendingPage from '@pages/TrendingPage';
import CategoryPage from '@pages/CategoryPage';
import AllProductsPage from '@pages/AllProductsPage';
import ProductDetailsPage from '@pages/ProductDetailsPage';
import CartPage from '@pages/CartPage';
import AdminLogin from '@pages/AdminLogin';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />{' '}
          <Route path="/all-products" element={<AllProductsPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          {/*  <Route path="/trending" element={<TrendingPage />} />*/}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
