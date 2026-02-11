import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: process.env.CAPACITOR_DEV_HOST || true,
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: env.DEV ? true : false,
      },
    },
    build: {
      target: 'es2019',
      sourcemap: false,
      outDir: '../dist/frontend',
    },
    optimizeDeps: {},
  };
});
