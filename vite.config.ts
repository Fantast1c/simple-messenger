import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "~/styles/variables.scss" as *;',
      },
    },
  },

  plugins: [
    VueRouter({
      extensions: ['.vue'],
      dts: 'src/route-map.d.ts',
    }),

    Vue(),

    AutoImport({
      imports: [
        'vue',
        'pinia',
        VueRouterAutoImports,
        {
          vue: ['defineProps', 'defineEmits', 'defineExpose', 'defineOptions', 'defineSlots', 'withDefaults'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),

    Components({
      dts: 'src/components.d.ts',
    }),
  ],
})
