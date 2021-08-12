// 填报接口
// base是为了切换API基础接口方便而创建的
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

const report = {
  // 保存项目
  saveReport(formId, params) {
    return axios.post(`${baseApi}/forms/${formId}/reports3`, params)
  },
  // 提交项目
  submitReport(formId, params) {
    return axios.post(`${baseApi}/forms/${formId}/reports`, params)
  },
  // 删除项目
  deleteReport(id) {
    return axios.delete(`${baseApi}/reports/${id}`)
  },
  // 更新项目
  uploadReport(id, params) {
    return axios.put(`${baseApi}/reports/${id}/update3`, params)
  },
  // 审核项目
  auditReport(id, params) {
    return axios.put(`${baseApi}/reports/${id}/audit`, params)
  },
  // 获取指定表单下的项目列表
  getReportList(formId) {
    return axios.get(`${baseApi}/forms/${formId}/reports`)
  },
  // 根据params查询条件获取项目列表
  queryReportList(params) {
    return axios.get(`${baseApi}/reports/query`, {
      params: params
    })
  },
  // 获取项目内容
  getReportContent(id) {
    return axios.get(`${baseApi}/reports/${id}/detail`)
  },
  // 获取重复的项目
  getDuplicateReport(params) {
    return axios.get(`${baseApi}/reports/duplicate`, params)
  }
}
export default report
