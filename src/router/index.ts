import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true // 需要身份验证
      }
    }
  ]
})
// 路由拦截器
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated && to.path == '/') {
    next({ name: 'login' })
  } else {
    next()
  }
})


export default router
