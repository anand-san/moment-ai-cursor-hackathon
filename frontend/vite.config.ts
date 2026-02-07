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
      target: 'esnext',
      sourcemap: false,
      outDir: '../dist/frontend',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return;
            }

            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/scheduler/')
            ) {
              return 'react-vendor';
            }

            if (id.includes('/react-router-dom/')) {
              return 'router';
            }

            if (id.includes('/firebase/')) {
              return 'firebase';
            }

            if (id.includes('/framer-motion/')) {
              return 'motion';
            }

            if (
              id.includes('/@capacitor/') ||
              id.includes('/@capacitor-community/') ||
              id.includes('/@capacitor-firebase/')
            ) {
              return 'capacitor';
            }

            if (id.includes('/@radix-ui/')) {
              return 'radix';
            }

            if (id.includes('/lucide-react/')) {
              return 'icons';
            }

            if (id.includes('/hono/')) {
              return 'api-client';
            }

            if (id.includes('/sonner/')) {
              return 'ui-feedback';
            }

            if (id.includes('/@sentry/')) {
              return 'sentry';
            }
          },
        },
      },
    },
    optimizeDeps: {},
  };
});
