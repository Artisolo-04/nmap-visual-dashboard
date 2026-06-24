import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 plugs directly into Vite as a plugin —
// no separate tailwind.config.js or postcss.config.js needed anymore
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
