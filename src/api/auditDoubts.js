// 字典接口
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

const auditDoubts = {
  // 创建存疑项目
  addAuditDoubts(params) {
    return axios.post(`${baseApi}/audit-doubts`, params)
  },
  // 删除存疑项目
  delAuditDoubts(id) {
    return axios.delete(`${baseApi}/audit-doubts/${id}`)
  },
  // 下线存疑项目
  offlineAuditDoubts(id) {
    return axios.put(`${baseApi}/audit-doubts/${id}/offline`)
  },
  // 获取存疑项目
  getAuditDoubts(id) {
    return axios.get(`${baseApi}/audit-doubts`)
  }
}
export default auditDoubts
