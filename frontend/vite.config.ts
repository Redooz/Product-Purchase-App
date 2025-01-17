import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests',
    mockReset: true,
    coverage: {
      provider: 'v8',
      exclude: [
        'node_modules',
        'test',
        '**/*.test.ts',
        '**/*.test.tsx',
        'vite.config.ts',
        '**/vite-env.d.ts',
        '**/setupTests.ts',
        '**/dto/*',
        '**/type/*',
        '**/main.tsx',
        '**/.vite',
        '**/dist',
      ],
    },
  },
});
