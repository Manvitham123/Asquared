import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/asquared-website/', // or '/' for custom domain
  plugins: [react()],
})

