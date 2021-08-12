import http from '../api/index'

// 规则转换方法，传入接口获取到的表单创建规则，转化为系统可生成界面的规则
async function ruleFormat(formRule) {
  // 规则存放数组
  const rule = []
  for (let i = 0; i < formRule.length; i++) {
    var obj = {}
    // 字段名称
    obj.title = formRule[i].name
    // 字段Value
    obj.field = formRule[i].code
    // 字段排序
    obj.weight = formRule[i].weight
    // 判断字段是否有配置项
    if (formRule[i].config) {
      // 关联栅格系统
      // obj.col = formRule[i].config.col || { span: 24 }
      // 关联字段属性
      obj.props = formRule[i].config.props || {}
    } else {
      // 没有配置项则设为全宽，和空参数。
      // obj.col = { span: 24 }
      obj.props = {}
    }
    // 声明字段验证规则
    obj.validate = []
    // 判断验证规则有哪些
    if (formRule[i].rules.includes('required')) {
      obj.validate.push({
        required: true,
        message: '此项必填!'
      })
    }
    if (formRule[i].rules.includes('numeric')) {
      obj.props.number = true
      obj.validate.push({
        type: 'number',
        message: '此项仅限数值!'
      })
    }
    // 表单默认值
    obj.props.placeholder = formRule[i].placeholder
    switch (formRule[i].type) { // 判断表单类型
      // 多行文本类型
      case 'textarea':
        obj.type = 'input'
        break
      // 自动完成
      case 'combobox':
        obj.type = 'autoComplete'
        obj.value = ''
        obj.props.data = await this.getAutoCompleteDictData(formRule[i].dictId)
        break
      // 数字输入框
      case 'number':
        obj.type = 'InputNumber'
        obj.value = ''
        break
      // 隐藏文本域
      case 'hidden':
        obj.type = 'hidden'
        break
      // 时间
      case 'date':
        obj.type = 'DatePicker'
        break
      // 下拉单选
      case 'select':
        obj.type = 'select'
        obj.props.clearable = true
        obj.options = await getSelectDictData(formRule[i].dictId)
        break
      // 下拉多选
      case 'selects':
        obj.type = 'select'
        obj.width = '100%'
        obj.props.multiple = true
        obj.options = await getSelectDictData(formRule[i].dictId)
        break
      // 单选
      case 'radiobox':
        obj.type = 'radio'
        obj.options = await getSelectDictData(formRule[i].dictId)
        break
      // 开关
      case 'switch':
        obj.type = 'switch'
        break
      // 复选框
      case 'checkbox':
        obj.type = 'checkbox'
        obj.options = await getSelectDictData(formRule[i].dictId)
        break
      // 级联选择
      case 'cascader':
        obj.type = 'cascader'
        obj.value = []
        obj.props.data = await getTreeDictData(formRule[i].dictId, '370000')
        break
      // 树状选择
      case 'tree':
        obj.type = 'tree'
        obj.props.multiple = true
        obj.props.showCheckbox = true
        obj.props.data = await getTreeDictData(formRule[i].dictId, '0')
        break
      // 单个文件上传
      case 'file':
        obj.type = 'uploadFiles'
        break
      // 多个文件上传
      case 'files': {
        obj.type = 'uploadFiles'
        break
      }
      // 默认为单行文本框
      default:
        obj.type = 'input'
    }
    rule.push(obj)
  }
  // console.log(rule);
  return rule
}

// 初始化表单数据
async function initFormData(formData, formRule) {
  const rule = await ruleFormat(formRule)
  if (formData) {
    for (const key in formData) {
      rule.map(val => {
        if (val.field === key && (val.type === 'select' || val.type === 'selects' || val.type === 'checkbox' || val.type === 'cascader' || val.type === 'tree' || val.type === 'file' || val.type === 'files' || val.type === 'uploadFiles' || (val.type === 'DatePicker' && val.props.type === 'daterange'))) {
          const formD = formData[key] ? formData[key].split(',') : formData[key]
          this.formCreateRule.fApi.setValue(key, formD)
        } else if (val.field === key && (val.type === 'InputNumber')) {
          this.formCreateRule.fApi.setValue(key, parseInt(formData[key]))
        } else if (val.field === key && val.type === 'switch') {
          this.formCreateRule.fApi.setValue(key, formData[key])
        } else if (val.field === key) {
          let data = formData[key]
          for (let i = 0; i < val.validate.length; i++) {
            if (val.validate[i].type && val.validate[i].type === 'number') {
              data = parseInt(formData[key])
              break
            }
          }
          this.formCreateRule.fApi.setValue(key, data)
        }
      })
    }
  }
}

async function getSelectDictData(dictId) {
  const select = []
  await http.dictionaries.getDic(dictId)
    .then(res => {
      const resData = res.data
      resData.map(val => {
        select.push({
          value: val.code,
          label: val.name
        })
      })
    })
  return select
}

// 获取树形数据1
async function getTreeDictData(dictId, cityId) {
  let tree = []
  if (dictId) {
    await http.dictionaries.getDic(dictId)
      .then(res => {
        const resData = res.data
        resData.map(val => {
          val.cid = val.id
          // 级联菜单
          val.value = val.code
          val.label = val.name
          // 树状菜单
          val.title = val.name
          val.id = val.code
        })
        tree = treeData(resData, cityId)
      })
  }
  return tree
}

// 格式化用户组数据返回树形结构
function treeData(sourceData, id) {
  const cloneData = JSON.parse(JSON.stringify(sourceData))
  return cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father.cid === child.parentId)
    branchArr.length > 0 ? father.children = branchArr : father.children = []
    return father.parentId + '' === id + ''
  })
}

function dataFormat(data, rule) {
  // console.log(rule);
  // console.log(data);
  const ruleData = {}
  rule.map(val => {
    ruleData[val.field] = val
  })
  const arrField = ['select', 'selects', 'cascader', 'radio', 'uploadFiles']
  for (const key in data) {
    if (arrField.includes(ruleData[key].type)) {
      // console.log(data[key]);
      data[key] && (data[key] = data[key].split(','))
      // console.log(data[key]);
    }
  }
  return data
}
export { ruleFormat, initFormData, getSelectDictData, getTreeDictData, treeData, dataFormat }
