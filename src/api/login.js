// 登录管理
import { baseApi } from '@/config'
import axios from '../utils/request'
const login = {
  password(username, password) {
    return axios.post(`${baseApi}/auth/login`, {
      username: username,
      password: password
    })
  }
}
export default login
