import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@styles/index.css'; // تأكدي إن الملف موجود فعلاً جوه src/styles
import App from '@/App';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@theme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { CartProvider } from '@context/CartContext.jsx';
import { UserProvider } from '@context/UserContext.jsx';

const cacheRtl = createCache({
  key: 'mui-rtl',
  stylisPlugins: [],
});
cacheRtl.compat = true;

createRoot(document.getElementById('root')).render(
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <CartProvider>
          <CssBaseline />
          <App />
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  </CacheProvider>
);
