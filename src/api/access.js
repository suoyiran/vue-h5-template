// 项目授权接口

import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

const dic = {
  // 修改访问权限，权限可以是角色也可以是用户组
  putAccess(model, modelId, grant, params) {
    return axios.put(`${baseApi}/models/${model}/${modelId}/${grant}`, params)
  },
  getAccess(model, modelId) {
    return axios.get(`${baseApi}/models/${model}/${modelId}/access`)
  }
}
export default dic
