// 文件上传接口
import { baseApi } from '@/config';
import axios from '../utils/request';
// import qs from 'qs' // 根据需求是否导入QS模块

const file = {
  // 上传表格
  uploadExcel (file) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      return axios.post(`${baseApi}/excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data; boundary=' + new Date().getTime() }
      });
    }
  },

  idToUrl (ids) {
    return axios.get(`${baseApi}/files/query`, {
      params: {
        ids: ids
      }
    });
  }
};
export default file;
