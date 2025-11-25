import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@shared': path.resolve(__dirname, './src/components/shared'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@context': path.resolve(__dirname, './src/context'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@admin': path.resolve(__dirname, './src/admin'), // مهم جدًا
      '@styles': path.resolve(__dirname, './src/styles'), // لو عندك styles
      '@theme': path.resolve(__dirname, './src/theme.js'),
    },
  },
});
