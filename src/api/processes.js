// 审核流程接口
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

const processes = {
  // 获取字典值
  getProcesses() {
    return axios.get(`${baseApi}/processes`)
  }
}
export default processes
