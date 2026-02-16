import path from 'path';
<<<<<<< HEAD
import react from '@vitejs/plugin-react';
=======
>>>>>>> ab4f963002b34ba4fb4c1c76c51ba585fe3f12d6
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
<<<<<<< HEAD
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
=======
>>>>>>> ab4f963002b34ba4fb4c1c76c51ba585fe3f12d6
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
<<<<<<< HEAD
      },
      build: {
        minify: 'terser',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'router': ['react-router-dom'],
              'charts': ['recharts']
            }
          }
        }
=======
>>>>>>> ab4f963002b34ba4fb4c1c76c51ba585fe3f12d6
      }
    };
});
