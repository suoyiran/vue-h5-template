// 动态接口
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

const activities = {
  // 获取表单字段统计
  getActivities() {
    return axios.get(`${baseApi}/activities`)
  },
  // 获取表单字段统计
  delActivites(id) {
    return axios.delete(`${baseApi}/activities/${id}`)
  }
}
export default activities
