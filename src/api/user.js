// 用户管理
import { baseApi } from '@/config'
import axios from '../utils/request'

const user = {
  getUserInfo(params) {
    return axios.get(`${baseApi}/me`, {
      params: params
    })
  },
  batchCreation(id, data) {
    return axios.post(`${baseApi}/sites/${id}/users`, data)
  }
}
export default user
