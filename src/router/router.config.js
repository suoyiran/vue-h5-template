/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/home'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user'),
    meta: {
      title: '个人页'
    }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('@/views/report/Report'),
    meta: {
      title: '信息编辑'
    }
  },
  {
    path: '/user/sign',
    name: 'Sign',
    component: () => import('@/views/user/sign'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/user/password',
    name: 'Password',
    component: () => import('@/views/user/password'),
    meta: {
      title: '修改密码'
    }
  },
  {
    path: '/user/personal',
    name: 'Personal',
    component: () => import('@/views/user/personal'),
    meta: {
      title: '个人信息'
    }
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/list/list'),
    meta: {
      title: '项目列表',
      keepAlive: true
    }
  },
  {
    path: '/404',
    name: 'Notfound',
    component: () => import('@/components/Notfound')
  },
  {
    path: '*',
    redirect: '/404'
  }
]
