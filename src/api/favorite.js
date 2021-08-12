// 收藏接口
import { baseApi } from '@/config';
import axios from '../utils/http';
// import qs from 'qs' // 根据需求是否导入QS模块

const favorites = {
  // 新增收藏,model可以是：report、user等可收藏的类型，modelId是模型相对的ID
  addFavorites (model, modelId) {
    return axios.get(`${baseApi}/favorites/${model}/${modelId}`);
  },
  // 获取收藏项目列表
  getFavorites () {
    return axios.get(`${baseApi}/favorites`);
  },
  // 获取收藏模型列表
  // model可以是：report、user等可收藏的类型
  getFavoritesModel (model) {
    return axios.get(`${baseApi}/favorites/${model}`);
  },
  // 取消收藏
  delFavorites (model, modelId) {
    return axios.delete(`${baseApi}/favorites/${model}/${modelId}`);
  }
};
export default favorites;
