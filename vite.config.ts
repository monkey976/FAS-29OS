import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), WindiCSS()],
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
  }
})
