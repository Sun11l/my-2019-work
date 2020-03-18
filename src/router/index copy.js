import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)




// 普通路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/components/errorPages/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '仪表盘', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/event',
    component: Layout,
    redirect: '/event/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/event/index'),
        name: 'Event',
        meta: { title: '事件', icon: 'event', keepAlive: true },
        children: [
          {
            path: 'detail',
            component: () => import('@/views/event/detail/index'),
            name: 'EventDetail',
            meta: { title: '详细信息', keepAlive: true },
            // beforeEnter: (to, from, next) => {
            //   next()
            // }
          }
        ]
      }
    ]
  },
  {
    path: '/playbooks',
    component: Layout,
    redirect: '/playbooks/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/playbooks/index'),
        name: 'Playbooks',
        meta: { title: '工作流', icon: 'playbooks', keepAlive: true }
      },
      {
        path: 'create',
        component: () => import('@/views/playbooks/editor/index'),
        name: 'PlaybooksEditor',
        meta: { title: '创建工作流', icon: 'playbooks', keepAlive: false }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/app',
    alwaysShow: true,
    name: 'Config',
    meta: {
      title: '设置',
      icon: 'setting',
      keepAlive: true,
    },
    children: [
      {
        path: 'app',
        component: () => import('@/views/config/app'),
        name: 'AppConfig',
        meta: {
          title: '应用设置',
          keepAlive: true,
        }
      },
      {
        path: 'user',
        component: () => import('@/views/config/user'),
        name: 'UserConfig',
        meta: {
          title: '用户设置',
          keepAlive: true,
        }
      },
      {
        path: 'data',
        component: () => import('@/views/config/data'),
        name: 'DataConfig',
        meta: {
          title: '数据配置',
          keepAlive: true,
        }
      },
      {
        path: 'logs',
        component: () => import('@/views/config/logs'),
        name: 'LogsConfig',
        meta: {
          title: '日志配置',
        }
      },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]


// 权限路由
export const asyncRoutes = []

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

window.$Router = router
export default router
