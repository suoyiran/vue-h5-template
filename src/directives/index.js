import permission from './permission'
import copy from './copy'
import lazyLoad from './lazyLoad'

// 自定义指令
const directives = {
  // 权限指令
  permission,
  // 快捷复制指令
  copy,
  // 资源懒加载
  lazyLoad
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
