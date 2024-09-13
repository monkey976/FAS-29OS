import { createRouter, createWebHistory } from 'vue-router'
import { diffTokenTime } from '@/utils/auth'
import { ElNotification } from 'element-plus'

import Layout from '../views/Home/Layout.vue'
import Login from '../views/Login/Login.vue'

import LayoutUser from '../views/HomeUser/Layout.vue'

import NotFound from '../views/Error/404.vue'

import Portal from '../views/Home/Portal.vue'
import User from '../views/User/User.vue'
import TDmodelManage from '../views/TDmodel/TDmodelManage.vue'
import TDmodelDetail from '../views/TDmodel/TDmodelDetail.vue'

import PortalUser from '../views/HomeUser/Portal.vue'
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
      name: 'index',
      component: Layout,
      meta: {
        requiresAuth: false // 需要身份验证
      }
    },
    {
      path: '/homeuser',
      name: 'homeuser',
      component: LayoutUser,
      redirect: '/portaluser',
      children: [
        {
          path: '/portaluser',
          name: 'portaluser',
          component: PortalUser
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: Layout,
      meta: {
        requiresAuth: true // 需要身份验证
      },
      redirect: '/portal',
      children: [
        {
          path: '/portal',
          name: 'portal',
          component: Portal,
          meta: {
            requiresAuth: true // 需要身份验证portal
          }
        },
        {
          path: '/user',
          name: 'user',
          component: User,
          meta: {
            requiresAuth: true // 需要身份验证portal
          }
        },
        {
          path: '/3Dmodel',
          name: '3Dmodel',
          component: TDmodelManage,
          meta: {
            requiresAuth: true // 需要身份验证portal
          }
        },
        {
          path: '/3DPreview',
          name: '3DPreview',
          component: TDModelPreview,
          meta: {
            requiresAuth: false // 需要身份验证portal
          }
        },
        {
          path: '/3Dmodel/detail',
          name: '3DmodelDetail',
          component: TDmodelDetail,
          meta: {
            requiresAuth: true // 需要身份验证portal
          }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
// 路由拦截器
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token') //是否有token了
  if (isAuthenticated) {
    if (diffTokenTime()) {
      next({ name: 'login' })
      localStorage.clear()
      ElNotification({
        title: '超时',
        message: 'token过期了，请重新登录',
        type: 'error'
      })
    } else {
      next()
    }
  } else {
    if (to.matched.some((record) => record.meta.requiresAuth) && to.path == '/') {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

export default router
