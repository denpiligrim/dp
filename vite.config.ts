import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/vendor/**', '**/storage/**', '**/bootstrap/cache/**'],
    },
  },
  plugins: [
    laravel({
      input: ['resources/ts/main.tsx'],
      refresh: true,
    }),
    react()
  ],
});
