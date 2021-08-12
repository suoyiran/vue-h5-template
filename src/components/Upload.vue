<template>
  <div>
    <div
      v-for="(item, index) in uploadList"
      :key="index"
      class="demo-upload-list"
    >
      <template v-if="item.status === 'finished'">
        <img
          v-if="item.url"
          width="100px"
          :src="item.url"
        >
        <img
          v-else
          width="100px"
          :src="item.response.data.url"
        >
        <div class="demo-upload-list-cover">
          <Icon
            type="ios-eye-outline"
            @click.native="handleView(item)"
          />
          <Icon
            type="ios-trash-outline"
            @click.native="handleRemove(item)"
          />
        </div>
      </template>
      <template v-else>
        <Progress
          v-if="item.showProgress"
          :percent="item.percentage"
          hide-info
        />
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :headers="{ 'Authorization':token, 'x-app': xApp}"
      multiple
      type="drag"
      action="http://api.invest.sdcom.gov.cn/api/files"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon
          type="ios-camera"
          size="20"
        />
      </div>
    </Upload>
    <Modal
      v-model="visible"
      :title="imgName"
    >
      <img
        v-if="visible"
        :src="imgSrc"
        style="width: 100%"
      >
    </Modal>
  </div>
</template>

<script>
import httpClient from '../utils/request'
export default {
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      defaultList: [],
      uploadList: [],
      files: [],
      fileUrlIds: {},
      fileIds: [],
      field: '',
      token: '',
      xApp: 'web0kw9S21nmD',
      visible: false,
      imgName: '',
      imgSrc: ''
    }
  },
  watch: {
    async value(ids) {
      if (this.defaultList.length === 0) {
        this.defaultList = await this.getFileUrl(ids)
      }
      this.$nextTick(() => {
        // 这样打印出来就会有值了
        this.uploadList = this.$refs.upload.fileList
      })
    },
    fileUrlIds() {
      this.onClick()
    }
  },
  created() {
    this.token = localStorage.token
    // this.xApp = localStorage.xApp;
  },
  methods: {
    async getFileUrl(filesId) {
      if (filesId.length > 0) {
        const res = await httpClient.get('/files/query', {
          params: {
            ids: filesId.toString()
          }
        })
        const resData = res.data
        const urlArr = []
        resData.map(val => {
          this.$set(this.fileUrlIds, val.id, val.url)
          urlArr.push({
            name: val.oldName,
            url: val.url
          })
        })
        return urlArr
      } else {
        return []
      }
    },
    onClick() {
      this.files = Object.keys(this.fileUrlIds)
      this.$emit('input', this.files)
    },
    // 上传成功
    handleSuccess(res, file) {
      this.$set(this.fileUrlIds, file.response.data.id, file.response.data.url)
      this.$Notice.success({
        title: '上传成功'
      })
    },
    handleView(item) {
      this.imgName = item.name
      item.url ? this.imgSrc = item.url : this.imgSrc = item.response.data.url
      this.visible = true
    },
    handleRemove(file) {
      // 删除已传列表缩略图
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      let filesUrl
      if (file.url) {
        filesUrl = file.url
      } else {
        filesUrl = file.response.data.url
      }
      for (const id in this.fileUrlIds) {
        if (this.fileUrlIds[id] === filesUrl) {
          this.$delete(this.fileUrlIds, id)
        }
      }
    },
    handleFormatError() {
      this.$Notice.warning({
        title: '上传的文件格式不正确',
        desc: '文件格式应为：png, jpeg, jpg, pdf, xls, xlsx, doc, docx, ppt, pptx中的一种'
      })
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '文件超出了限制体积大小',
        desc: '文件  ' + file.name + ' 最大不能超过 2M.'
      })
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传5个文件'
        })
      }
      return check
    }
  }
}
</script>

<style lang="scss" scoped>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
