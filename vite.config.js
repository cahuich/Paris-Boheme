import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Paris-Boheme/', // reemplaza TU_REPO por el nombre de tu repo
  plugins: [react()],
})
