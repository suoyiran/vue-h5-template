// 按需全局引入 vant组件
import Vue from 'vue'
import Vant from 'vant'
import { Toast } from 'vant'
Toast.setDefaultOptions({ duration: 500 })
Toast.setDefaultOptions('loading', { forbidClick: true })

Vue.use(Vant)
