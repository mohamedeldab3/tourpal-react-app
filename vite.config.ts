import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'adminDashboard': './src/pages/dashboard/AdminDashboard.tsx',
        'providerDashboard': './src/pages/dashboard/ProviderDashboard.tsx',
        'userDashboard': './src/pages/dashboard/UserDashboard.tsx',
        'profile': './src/pages/dashboard/Profile.tsx'
      }
    },
    chunkSizeWarningLimit: 800,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
