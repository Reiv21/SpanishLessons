import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base musi pasować do nazwy repo, bo strona jest pod
// https://reiv21.github.io/SpanishLessons/
export default defineConfig({
  base: '/SpanishLessons/',
  plugins: [react()],
})
