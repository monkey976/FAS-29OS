import { createRouter, createWebHistory } from 'vue-router'
import { diffTokenTime } from '@/utils/auth'
import { ElNotification } from 'element-plus'

import Layout from '../views/Home/Layout.vue'
import Login from '../views/Login/Login.vue'

import LayoutUser from '../views/HomeUser/Layout.vue'
import CompanyIntro from '../views/HomeUser/CompanyIntro.vue'
import ChairmanSpeech from '../views/HomeUser/ChairmanSpeech.vue'
import TopicAnalysis from '../views/HomeUser/TopicAnalysis.vue'
import NewsPage from '../views/HomeUser/NewsPage.vue'
import ContactUs from '../views/HomeUser/ContactUs.vue'
import ProductIntro from '../views/HomeUser/ProductIntro.vue'
import Service from '../views/HomeUser/Service.vue'
import NotFound from '../views/Error/404.vue'

import Portal from '../views/Home/Portal.vue'
import User from '../views/User/User.vue'
import TDmodelManage from '../views/TDmodel/TDmodelManage.vue'
import TDmodelDetail from '../views/TDmodel/TDmodelDetail.vue'
import TDModelPreview from '../views/TDmodel/TDModelPreview.vue'
import TDModelUpload from '../views/TDmodel/TDModelUpload.vue'

import PortalUser from '../views/HomeUser/Portal.vue'
import DicomLoader from '@/views/Dicom/DicomLoader.vue'
import NiiLoader from '@/views/Dicom/NiiLoader.vue'

import CaseHistory from '@/views/CaseHistory/CaseHistory.vue'
import CaseHistoryManager from '@/views/CaseHistory/caseHistoryManager.vue'

import Demo from '@/views/Dicom/demo.vue'
import CaseDetail from '@/views/CaseHistory/CaseDetail.vue'

import Segment from '@/views/Doctor/Segment.vue'
import CaseNussFusion from '@/views/Doctor/CaseNussFusion.vue'
import TwoModelFusion from '@/views/Doctor/TwoModelFusion.vue'
import AIGCNussSlicing from '@/views/Doctor/AIGCNussSlicing.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/demo',
      name: 'demo',
      component: Demo
    },
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
        requiresAuth: true // 需要身份验证
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
        },
        {
          path: '/company',
          name: 'company',
          component: CompanyIntro
        },
        {
          path: '/ChairmanSpeech',
          name: 'ChairmanSpeech',
          component: ChairmanSpeech
        },
        {
          path: '/TopicAnalysis',
          name: 'TopicAnalysis',
          component: TopicAnalysis
        },
        {
          path: '/NewsPage',
          name: 'NewsPage',
          component: NewsPage
        },
        {
          path: '/ContactUs',
          name: 'ContactUs',
          component: ContactUs
        },
        {
          path: '/ProductIntro',
          name: 'ProductIntro',
          component: ProductIntro
        },
        {
          path: '/Service',
          name: 'Service',
          component: Service
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
            requiresAuth: true // 需要身份验证
          }
        },
        {
          path: '/user',
          name: 'user',
          component: User,
          meta: {
            requiresAuth: true // 需要身份验证
          }
        },
        {
          path: '/3Dmodel',
          name: '3Dmodel',
          component: TDmodelManage,
          meta: {
            requiresAuth: true // 需要身份验证
          }
        },
        {
          path: '/3DPreview',
          name: '3DPreview',
          component: TDModelPreview,
          meta: {
            requiresAuth: true // 需要身份验证
          }
        },
        {
          path: '/3DUpload',
          name: '3DUpload',
          component: TDModelUpload,
          meta: {
            requiresAuth: true // 需要身份验证
          }
        },
        {
          path: '/3Dmodel/detail',
          name: '3DmodelDetail',
          component: TDmodelDetail,
          meta: {
            requiresAuth: true // 需要身份验证
          }
        },
        {
          path: '/doctor/dicomloader',
          name: 'dicomloader',
          component: DicomLoader,
          meta: {
            requiresAuth: false // 需要身份验证portal
          }
        },
        {
          path: '/doctor/niiloader',
          name: 'niiloader',
          component: NiiLoader,
          meta: {
            requiresAuth: false // 需要身份验证portal
          }
        },
        {
          path: '/caseHistory',
          name: 'caseHistory',
          component: CaseHistory,
          meta: {
            requiresAuth: false // 需要身份验证portal
          }
        },
        {
          path: '/caseHistoryManager',
          name: 'caseHistoryManager',
          component: CaseHistoryManager,
          meta: {
            requiresAuth: true // 需要身份验证portal
          }
        },
        {
          path: '/cases/:caseId',
          name: 'CaseDetails',
          component: CaseDetail,
          meta: {
            requiresAuth: true // 需要身份验证portal
          }
        },
        {
          path: '/doctor/segment',
          name: 'segment',
          component: Segment,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: '/doctor/casenussfusion',
          name: 'casenussfusion',
          component: CaseNussFusion,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: '/doctor/TwoModelFusion',
          name: 'TwoModelFusion',
          component: TwoModelFusion,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: '/doctor/AIGCNussSlicing',
          name: 'AIGCNussSlicing',
          component: AIGCNussSlicing,
          meta: {
            requiresAuth: false
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
  const isAuthenticated = localStorage.getItem('token') //是否有token了
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
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

export default router
