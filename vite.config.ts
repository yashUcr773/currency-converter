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
                    utils: ['lucide-react', 'clsx', 'tailwind-merge'],
                    clerk: ['@clerk/clerk-react'],
                    aws: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb']
                }
            },
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
                unknownGlobalSideEffects: false,
            },
        },
        // Production optimizations
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        // Improve build performance
        sourcemap: false,
        // Chunk size warning limit
        chunkSizeWarningLimit: 1000,
        // Target modern browsers for better optimization
        target: 'esnext',
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Optimize asset handling
        assetsInlineLimit: 4096,
    },
    // Ensure manifest.json and service worker are properly served
    publicDir: 'public',
    // Development server config
    server: {
        port: 5173,
        host: true,
        // Removed CSP headers for development to avoid Clerk conflicts
    },
    // Production server config
    preview: {
        port: 3000,
        host: true
    },
    // Define environment variables
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    // Optimize deps
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
        exclude: ['dev-tools']
    }
})
