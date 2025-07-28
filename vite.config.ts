import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": resolve(import.meta.dirname || ".", "./src"),
        },
    },
    // PWA configuration for service worker
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                sw: resolve(__dirname, 'public/sw.js')
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    return chunkInfo.name === 'sw' ? 'sw.js' : '[name]-[hash].js'
                },
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-scroll-area'],
                    i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
                    utils: ['lucide-react', 'clsx', 'tailwind-merge']
                }
            }
        },
        // Production optimizations
        minify: 'terser',
        // Improve build performance
        sourcemap: false,
        // Chunk size warning limit
        chunkSizeWarningLimit: 500
    },
    // Ensure manifest.json and service worker are properly served
    publicDir: 'public',
    // Production server config
    preview: {
        port: 3000,
        host: true
    }
})
