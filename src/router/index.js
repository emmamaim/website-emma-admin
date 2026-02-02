import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    // ===== 登入頁 =====
    {
      path: '/login',
      component: () => import('@/layouts/LoginLayout.vue'),
      children: [
        {
          path: '',
          name: 'LoginAccount',
          component: () => import('@/views/LoginAccount.vue')
        }
      ]
    },

    // ===== 後台（需要登入）=====
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'DashboardDetails',
          component: () => import('@/views/DashboardDetails.vue')
        },
        {
          path: 'products',
          name: 'ProductsDetails',
          component: () => import('@/views/ProductsDetails.vue')
        },
        {
          path: 'members',
          name: 'MembersDetails',
          component: () => import('@/views/MembersDetails.vue')
        },
        {
          path: 'orders',
          name: 'OrdersDetails',
          component: () => import('@/views/OrdersDetails.vue')
        },
        {
          path: 'news',
          name: 'NewsDetails',
          component: () => import('@/views/NewsDetails.vue')
        }
      ]
    },

    // ===== 404 =====
    {
      path: '*',
      redirect: '/'
    }
  ]
})

/* ===== Router Guard ===== */
router.beforeEach((to, from, next) => {
  const isLogin = store.state.isLogin

  if (to.path !== '/login' && !isLogin) {
    next('/login')
  } else if (to.path === '/login' && isLogin) {
    next('/')
  } else {
    next()
  }
})

export default router
