import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from './router.config.js'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    // base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()

// 写一个重置路由的方法，切换用户后，或者退出时清除动态加载的路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 新路由实例matcer，赋值给旧路由实例的matcher，（相当于replaceRouter）
}

// 无token无需跳转的页面
router.beforeEach(async(to, from, next) => {
  console.log(to)
  // document.querySelector('body').setAttribute('style', 'background-color:#EFEFEF');
  // if(to){
  //   return {
  //       x: 0,
  //       y: 0
  //   };
  // }
  // window.document.title = to.name;
  const guestRoutes = [
    '/oauth/wechat',
    '/oauth/callback'
  ]
  if (guestRoutes.indexOf(to.path) > -1) {
    next()
  } else {
    const token = localStorage.getItem('authorization')
    if ((token === null || token === '') && to.path !== '/mine/login') {
      next('/mine/login')
    } else {
      next()
    }
  }
})

export default router
