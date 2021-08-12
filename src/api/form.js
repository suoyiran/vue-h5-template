// 表单接口
import { baseApi } from '@/config';
import axios from '../utils/request';
// import qs from 'qs' // 根据需求是否导入QS模块

const form = {
  getForms () {
    return axios.get(`${baseApi}/forms`);
  },
  // 获取表单字段统计
  getStatuses (reprotId) {
    return axios.get(`${baseApi}/forms/${reprotId}/statuses2`);
  },
  // 获取表单字段统计
  getformsContent (reprotId) {
    return axios.get(`${baseApi}/forms/${reprotId}`);
  },
  getFormFields (formId) {
    return axios.get(`${baseApi}/forms/${formId}/fields`);
  },
  importForm (formId, file) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      return axios.post(`${baseApi}/forms/${formId}/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data; boundary=' + new Date().getTime() }
      });
    }
  },
  exportTemplates (formId) {
    return axios.get(`${baseApi}/forms/${formId}/excel`);
  }
};
export default form;
