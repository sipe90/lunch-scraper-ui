import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../server/public',
  },
  server: {
    open: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:8080',
        xfwd: true,
      },
    },
  },
})
