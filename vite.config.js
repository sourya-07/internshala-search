import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Internshala's search endpoint blocks cross-origin browser requests, so we
// proxy it through the dev server and call /api/hiring/search from the client.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://internshala.com',
        changeOrigin: true,
        // Follow the occasional redirect on the server side so the browser
        // never gets a cross-origin 302 it can't follow.
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
