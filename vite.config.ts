/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  root: fs.realpathSync('.'),
  plugins: [react()],
  server: {
    fs: {
      // Enforce strict file system serving to prevent arbitrary file disclosure (e.g. /@fs/etc/passwd)
      strict: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
