// 系统信息配置
// base是为了切换API基础接口方便而创建的
import { baseApi } from '@/config';
import axios from '../utils/request';
// import qs from 'qs' // 根据需求是否导入QS模块

const system = {
  // 获取系统key
  getWhoami (xOrigin) {
    if (xOrigin) {
      return axios.get(`${baseApi}/whoami`, {
        headers: {
          'x-origin': xOrigin
        }
      });
    } else {
      return axios.get(`${baseApi}/whoami`);
    }
  },
  // 获取系统配置信息
  getConfig (xApp) {
    return axios.get(`${baseApi}/sites/config`, {
      headers: {
        'x-app': xApp
      }
    });
  }
};
export default system;
