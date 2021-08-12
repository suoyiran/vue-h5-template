// 字典操作接口
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

const dic = {
  // 获取字典
  getDic(id) {
    return axios.get(`${baseApi}/dictionaries/${id}`)
  },
  getDicRoles2() {
    return this.getDic('roles2')
  },
  getDicTeams() {
    return this.getDic('teams')
  },
  getDicName(id, code) {
    return axios.get(`${baseApi}/dictionaries/${id}/${code}`)
  }
}
export default dic
