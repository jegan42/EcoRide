import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // à créer
    coverage: {
      provider: 'istanbul', // ou 'v8' si tu préfères
      reporter: ['text', 'html', 'lcov'], // Tu peux personnaliser
      reportsDirectory: './coverage',
      exclude: ['**/__tests__/**', '**/*.test.tsx'],
    },
  },
});
