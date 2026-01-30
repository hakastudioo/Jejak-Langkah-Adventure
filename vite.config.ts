
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY || ""),
      'process.env.VITE_GSCRIPT_URL': JSON.stringify(env.VITE_GSCRIPT_URL || ""),
      'process.env.VITE_SPREADSHEET_ID': JSON.stringify(env.VITE_SPREADSHEET_ID || "")
    },
    plugins: [react()],
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
