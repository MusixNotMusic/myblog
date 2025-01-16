import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import glsl from 'vite-plugin-glsl';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    glsl({
      include: [                   // Glob pattern, or array of glob patterns to import
        '**/*.glsl', '**/*.wgsl',
        '**/*.vert', '**/*.frag',
        '**/*.vs', '**/*.fs'
      ],
      exclude: undefined,          // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      defaultExtension: 'glsl',    // Shader suffix when no extension is specified
      compress: false,             // Compress output shader code
      watch: true,                 // Recompile shader on change
      root: '/'                    // Directory for root imports
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
