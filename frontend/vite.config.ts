import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // PWA temporalmente desactivada hasta implementar iconos propios
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    //   manifest: {
    //     name: 'Math4Life',
    //     short_name: 'Math4Life',
    //     description: 'Interactive Math Learning Platform',
    //     theme_color: '#1976d2',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     icons: [
    //       {
    //         src: '/pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: '/pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://backend:4000',
        changeOrigin: true
      }
    }
  }
})