// 字典接口
import { baseApi } from '@/config'
import axios from '../utils/request'
// import qs from 'qs' // 根据需求是否导入QS模块

const dictionary = {
  // 获取字典
  getDictionary(dicId) {
    return axios.get(`${baseApi}/dictionaries/${dicId}`)
  },
  // 查询字典值
  getDictionaryName(dicId, codes) {
    return axios.get(`${baseApi}/dictionaries/${dicId}/${codes}`)
  }
}
export default dictionary
