import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Internshala's endpoints block cross-origin browser requests, so in dev we
// proxy them through the Vite server and call /api/* from the client.
// (In production the same job is done by the serverless function in /api.)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.INTERNSHALA_BASE_URL || 'https://internshala.com';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          // Follow the occasional redirect on the server side so the browser
          // never gets a cross-origin 302 it can't follow.
          followRedirects: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
