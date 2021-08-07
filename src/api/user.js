// 填报接口
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

export default {
  login(params) {
    return axios.post(`${baseApi}/auth/login`, params)
  }
}
