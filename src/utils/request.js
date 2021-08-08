import axios from 'axios'
import router from '../router/index'
import { v4 as UUIDv4 } from 'uuid'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

const appId = 'wechatj6FKZXzuBK'

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    // 获取设备ID
    let deviceId = localStorage.getItem('deviceId')
    // 如果没有获取到设备ID，就创建一个设备ID，并且储存到本地
    if (!deviceId) {
      deviceId = UUIDv4()
      localStorage.setItem('deviceId', deviceId)
    }

    config.headers['x-request'] = UUIDv4()
    config.headers['x-timestamp'] = ((new Date()) / 1000).toFixed(0)
    config.headers['x-device'] = deviceId
    config.headers['x-app'] = appId

    const token = localStorage.authorization
    // 添加头部信息
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        Toast('身份过期，请重新登录')
        localStorage.clear()
        router.replace({
          path: '/user/sign',
          query: {
            queryname: 'we_chart'
          }
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
