// 用户组管理
import { baseApi } from '@/config'
import axios from '../utils/request'
const groups = {
  addGroups(groupsInfo) {
    return axios.post(`${baseApi}/groups`, groupsInfo)
  },
  getGroups(id) {
    return axios.get(`${baseApi}/groups/admin`, {
      type: 'role'
    })
  },
  delGroups(id) {
    return axios.delete(`${baseApi}/groups/${id}`)
  },
  editGroups(id, groupsInfo) {
    return axios.put(`${baseApi}/groups/${id}`, groupsInfo)
  }
}
export default groups
