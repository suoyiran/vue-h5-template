<template>
  <div
    id="regular-tables"
    tag="section"
    fluid
  >
    <Header />
    <div class="form_box">
        <formCreate
        v-model="formCreateRule.fApi"
        :rule="formCreateRule.rule"
        :option="formCreateRule.option"
      />
      <div class="qiaall">
        <van-button
          round
          block
          class="qiaall_shan qiaall_bao"
          @click="saveBtn()"
        ><i class="iconfont iconxiangmu"></i>保存</van-button>
        <van-button
          round
          block
          class="qiaall_shan "
          @click="submitBtn()"
        ><i class="iconfont iconxiangmu"></i>提交</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import formCreate from '@form-create/iview'
import Vue from 'vue'
import Upload from '../../components/Upload'
import userPhoto from '../../assets/head.jpg'
import { ruleFormat } from '../../utils/form'
import httpClient from '../../utils/request'
import { Toast } from 'vant'
Vue.use(iView)
export default {
  components: {
    Header: () => import('../../components/Header'),
    formCreate: formCreate.$form()
  },
  data: () => ({
    uploadList: [],
    userPhoto: userPhoto,
    // 项目阶段选择下拉菜单数据源
    stages: [],
    formId: null,
    formCreateRule: { // 表单创建规则
      // 实例对象
      fApi: {},
      // 表单生成规则
      rule: [],
      // 组件参数配置
      option: {
        submitBtn: false,
        form: {
          labelWidth: undefined,
          labelPosition: 'top'
        },
        row: {
          gutter: 30
        }
      }
    },
    project: null,
    projectId: null,
    formAreaCode: '',
    T: null,
    map: null,
    lnglat: [],
    openlayer: null,
    graphicLayer: null,
    controls: null,
    vectors: null,
    featureArr: [],
    files: {}
  }),
  async created() {
    // 如果有表单ID，就获取赋值
    if (this.$route.query.formId) {
      this.formId = this.$route.query.formId
      console.log(this.formId)
    }
    // 如果有项目ID，就获取赋值
    if (this.$route.query.id) {
      this.projectId = this.$route.query.id
      console.log(this.projectId)
    }
    this.createForm(this.formId, this.projectId)
    this.getFormsSelect()
  },
  mounted() {
    this.$nextTick(async() => {
    })
    Vue.component('uploadFiles', Upload)
  },
  methods: {
    async getFormsSelect() {
      const forms = await httpClient.get('/forms')
      const formData = await httpClient.get(`/forms/${this.formId}`)
      const formType = formData.data.categoryId
      this.stages = forms.data.filter(val => {
        return formType === val.categoryId
      })
      this.stages.sort((a, b) => {
        return a.weight - b.weight
      })
    },
    // 创建表单
    async createForm(formId, projectId) { // 赋值表单的创建规则
      const formRule = await this.formRule(formId) // 获取表单规则
      const rule = await ruleFormat(formRule) // 过滤表单规则
      this.formCreateRule.rule = rule // 将过滤后的规则赋值给表单组件
      const formData = await this.inputValue(projectId) // 获取项目数据
      await this.initFormData(rule, formData, formRule)
    },
    // 获取创建表单的原始规则
    async formRule(formId) {
      if (formId) {
        const formData = await httpClient.get('/forms/' + formId + '/fields')
        return formData.data
      }
    },
    // 获取自动补全数据
    async getAutoCompleteDictData(dictId) {
      const select = []
      if (dictId) {
        await httpClient.get(`/dictionaries/${dictId}`)
          .then(res => {
            const resData = res.data
            resData.map(val => {
              select.push(val.code)
            })
          })
      }
      return select
    },
    // 获取选择列表数据
    async getSelectDictData(dictId) {
      const select = []
      await httpClient.get(`/dictionaries/${dictId}`)
        .then(res => {
          const resData = res.data
          resData.map(val => {
            if (val.name === '吕涛书记重点调度项目') {
              select.push({
                value: val.code,
                label: val.name,
                disabled: true
              })
            } else {
              select.push({
                value: val.code,
                label: val.name
              })
            }
          })
        })
      return select
    },
    // 获取树形数据1
    async getTreeDictData(dictId, cityId) {
      let tree = []
      if (dictId) {
        await httpClient.get(`/dictionaries/${dictId}`)
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
            tree = this.treeData(resData, cityId)
          })
      }
      return tree
    },
    // 格式化用户组数据返回树形结构
    treeData(sourceData, id) {
      const cloneData = JSON.parse(JSON.stringify(sourceData))
      return cloneData.filter(father => {
        const branchArr = cloneData.filter(child => father.cid === child.parentId)
        branchArr.length > 0 ? father.children = branchArr : father.children = []
        return father.parentId + '' === id + ''
      })
    },
    // 初始化表单数据
    async initFormData(rule, formData, formRule) {
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
    },
    // 获取项目信息
    async inputValue(projectId) {
      // 判断是否有项目ID，新增项目是没有项目ID的
      if (projectId) {
        const projectInfo = await httpClient.get(`/reports/${projectId}/detail`)
        return projectInfo.data.data
      } else {
        return null
      }
    },
    // 保存按钮
    saveBtn:
    _.throttle(function() {
      this.formCreateRule.fApi.validate((valid) => {
        if (valid) {
          this.formCreateRule.fApi.submit(async(formData) => {
            this.saveData(this.formId, this.projectId, await this.filterFormData(formData))
          })
        } else {
          Toast.fail('表单验证未通过')
        }
      })
    }, 1500, { 'trailing': false }),
    // 提交按钮
    submitBtn:
    _.throttle(function() {
      this.formCreateRule.fApi.validate((valid) => {
        if (valid) {
          this.formCreateRule.fApi.submit(async(formData) => {
            this.submitData(this.formId, this.projectId, await this.filterFormData(formData))
          })
        } else {
          Toast.fail('表单验证未通过')
        }
      })
    }, 1500, { 'trailing': false }),
    // 格式化表单数据
    filterFormData(formData) {
      const obj = formData
      Object.keys(obj).forEach(item => {
        if (Array.isArray(obj[item]) && !obj[item].length) delete obj[item]
        if (Array.isArray(obj[item])) obj[item] = obj[item].toString()
        if (obj[item] === '' || obj[item] === null || obj[item] === ',') delete obj[item]
      })
      return obj
    },
    // 保存表单数据
    async saveData(formId, id, filterFormData) {
      let requert = null
      const weight = filterFormData.weight !== null ? filterFormData.weight : 1000000
      if (!id) {
        requert = httpClient.post(`/forms/${formId}/reports3`, {
          data: filterFormData,
          status: 0,
          weight: weight
        })
      } else {
        requert = httpClient.put(`/reports/${id}/update3`, {
          data: filterFormData,
          weight: weight
        })
      }
      requert.then((res) => {
        Toast.success('保存成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      })
        .catch((err) => {
          console.log(err)
          Toast('保存失败')
        })
    },
    // 提交表单数据
    submitData(formId, id, filterFormData) {
      let requert = null
      const weight = filterFormData.weight !== null ? filterFormData.weight : 1000000
      if (!id) {
        requert = httpClient.post(`/forms/${formId}/reports3`, {
          data: filterFormData,
          status: 0,
          weight: weight
        })
      } else {
        requert = httpClient.put(`/reports/${id}/update3`, {
          data: filterFormData,
          weight: weight
        })
      }
      requert.then((res) => {
        let projectId = null
        if (id) {
          projectId = id
        } else {
          projectId = res.data.id
        }
        httpClient.put(`/reports/${projectId}/submit`)
          .then(async res => {
            Toast.success('提交成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 500)
          })
          .catch((err) => {
            console.log(err)
            Toast('提交失败')
          })
      })
        .catch((err) => {
          console.log(err)
          Toast('提交失败')
        })
    }
  }
}
</script>
<style scoped lang='scss'>
.form_box{
  padding: 15px;
}
.qiaall {
  display: flex;
  justify-content: space-between;
  .qiaall_shan {
    i {
      padding-right: 5px;
    }
    width: 160px;
    height: 40px;
    opacity: 1;
    background: linear-gradient(137deg, #ffb14d 3%, #ff9000);
    border-radius: 10px;

    span {
      color: #fff;
      padding: 8px 12px;
      border-radius: 5px;
    }
  }
  .qiaall_bao {
    background: linear-gradient(137deg, #4faaf5 3%, #2196f3);
  }

  .qiaup {
    z-index: 999;
  }
}
::v-deep .ivu-input-number{
  width: 100% !important;
}
</style>
