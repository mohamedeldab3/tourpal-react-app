import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            './src/components/ui/Button.tsx',
            './src/components/ui/Input.tsx',
            './src/components/ui/Modal.tsx'
          ],
          'auth': [
            './src/pages/auth/Login.tsx',
            './src/pages/auth/Register.tsx',
            './src/api/authService.ts'
          ],
          'dashboard': [
            './src/pages/dashboard/AdminDashboard.tsx',
            './src/pages/dashboard/ProviderDashboard.tsx',
            './src/pages/dashboard/UserDashboard.tsx',
            './src/pages/dashboard/Profile.tsx'
          ]
        }
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
