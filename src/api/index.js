// api 接口的统一出口
// 文章模块接口
import report from './report';
import system from './system';
import login from './login';
import file from './file';
import user from './user';
import dictionaries from './dictionaries';
import groups from './groups';
import form from './form';
import access from './access';
import dictionary from './dictionary';
// 其他模块的接口...

// 导出接口
export default {
  report,
  system,
  login,
  file,
  user,
  dictionaries,
  groups,
  form,
  access,
  dictionary
};
