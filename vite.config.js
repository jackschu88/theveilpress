import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dedicated port so this never collides with other Vite apps (often on 5173).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 5180,
    strictPort: true,
  },
})

