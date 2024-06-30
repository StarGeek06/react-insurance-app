import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Specify the correct entry point for your application
      input: 'App.jsx' // Replace with your actual entry point file
    }
 }
})

