import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境时移除 console
        drop_debugger: true, // 生产环境时移除 debugger
      },
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  base:'',
  server: {
    cors: true, // 默认启用并允许任何源
    open: true, //自动打开
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // 正则表达式写法
      '^/Api': {
        target: 'http://www.example.com/', // 后端服务实际地址
        changeOrigin: true, //开启代理
      },
    },
  },
})
