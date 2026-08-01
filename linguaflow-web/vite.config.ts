import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server for the LinguaFlow learner web app.
// The app talks to the existing .NET API directly (CORS-enabled) using
// VITE_API_URL, so no dev proxy is required.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
