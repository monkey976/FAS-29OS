import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'
import wasm from 'vite-plugin-wasm'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), WindiCSS(), wasm()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    //接口跨域问题
    host: `0.0.0.0`,
    // https: true, //是否使用https协议
    open: true //表示在启动开发服务器时，会自动打开浏览器并访问指定的地址y
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.32.42:5263',
    //     changeOrigin: true,
    //     ws: true,            //是否代理 websockets
    //     secure: true,          //是否https接口
    //     pathRewrite: {
    //       '^/api': ''  //假如我们的地址是 /api/member/getToken 会转化为 /member/getToken
    //     }
    //   }
    // }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.png')) {
            // 返回不带哈希的文件名
            return 'images/[name][extname]' // 输出路径为 images/yourImage.png
          }
          return '[name]-[hash][extname]' // 其他文件保留哈希
        }
      }
    }
  }
})
