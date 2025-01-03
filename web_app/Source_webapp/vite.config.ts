import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'
import fs from 'fs'

const fileExists = (filePath) => {
    try {
        return fs.existsSync(filePath)
    } catch (e) {
        return false
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-macros'],
            },
        }),
        dynamicImport(),
    ],
    server: {
        https:
            fileExists('./localhost-key.pem') && fileExists('./localhost.pem')
                ? {
                      key: fs.readFileSync(
                          path.resolve(__dirname, './localhost-key.pem')
                      ),
                      cert: fs.readFileSync(
                          path.resolve(__dirname, './localhost.pem')
                      ),
                  }
                : false,
        host: 'localhost',
        port: 3000, // Or any port of your choice
    },
    assetsInclude: ['**/*.md'],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'build',
        rollupOptions: {
            treeshake: true,
        },
        chunkSizeWarningLimit: 2000, // Increase the limit if your chunks are large
    },
    preview: {
        port: 80,
    },
})
