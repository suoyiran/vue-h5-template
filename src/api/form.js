// 填报接口
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

export default {
  // 提交项目
  submit(formId, params) {
    console.log(baseApi)

    return axios.post(`${baseApi}/forms/${formId}/reports`, params)
  },
  // 删除项目
  delete(id) {
    return axios.delete(`${baseApi}/reports/${id}`)
  },
  // 更新项目
  upload(id, params) {
    return axios.put(`${baseApi}/reports/${id}`, params)
  },
  // 审核项目
  audit(id, params) {
    return axios.put(`${baseApi}/reports/${id}/audit`, params)
  },
  // 获取指定表单下的项目列表
  getList(formId) {
    return axios.get(`${baseApi}/forms/${formId}/reports`)
  },
  // 根据params查询条件获取项目列表
  queryList(params) {
    return axios.get(`${baseApi}/reports/query`, {
      params: params
    })
  },
  // 获取项目内容
  getContent(id) {
    return axios.get(`${baseApi}/reports/${id}/detail`)
  },
  // 获取重复的项目
  getDuplicate(params) {
    return axios.get(`${baseApi}/reports/duplicate`, params)
  }
}
