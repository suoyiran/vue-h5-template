/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页' }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/home/about'),
        meta: { title: '关于我' }
      }
    ]
  },
  {
    path: '/mine/login',
    name: '登录',
    component: () => import('@/views/mine/login')
  },
  {
    path: '/404',
    name: '错误页',
    component: () => import('@/components/Notfound')
  },
  {
    path: '*',
    redirect: '/404'
  }
]
