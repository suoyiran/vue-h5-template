<template>
  <div>
    <van-overlay :show="!loadShow">
      <van-loading
        v-show="!loadShow"
        type="spinner"
        size="50px"
      >加载中...</van-loading>
    </van-overlay>
    <van-cell-group class="logcellm">
      <van-field
        placeholder="Nickname"
        rows="1"
        autosize
        type="textarea"
        v-model="data.nickname"
        input-align="right"
        maxlength="6"
      >
        <template #left-icon>
          <i class="iconfont icon777"></i>
          <span>昵称</span>
        </template>
      </van-field>
      <div class="gasoline-morecns">
        <div class="gasoline-moreones">
          <i class="iconfont icontouxiang"></i>
          <span>头像</span>
        </div>
        <div class="gasoline-moretwos">
          <div class="opinups">
            <van-uploader
              class="opinder"
              image-fit='cover'
              id="file"
              :after-read="submitPic"
              accept="image/*"
              v-model="fileList"
              multiple
              :max-count="1"
            />
          </div>
        </div>
      </div>
      <van-field
        placeholder="请输入职位"
        rows="1"
        autosize
        type="textarea"
        v-model="data.motto"
        input-align="right"
      >
        <template #left-icon>
          <i class="iconfont iconzhiwu"></i>
          <span>职位</span>
        </template>
      </van-field>
      <van-field
        placeholder="请输入部门"
        rows="1"
        autosize
        type="textarea"
        v-model="data.office"
        input-align="right"
      >
        <template #left-icon>
          <i class="iconfont iconcompany"></i>
          <span>部门</span>
        </template>
      </van-field>
      <van-cell
        title="微信绑定"
        icon="chat-o"
      >
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <span @click="bindcl">{{ isbind ? '解绑' : '去绑定' }}</span>
          <i class="iconfont icon-youjiantou"></i>
        </template>
      </van-cell>
      <div class="pad-all mar-top">
        <van-button
          round
          block
          type="primary"
          @click="submit"
        >
          保存修改
        </van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import Exif from 'exif-js'
import {
  Toast
} from 'vant'
import httpClient from '../../utils/request'
export default {
  data() {
    return {
      loadShow: true,
      sol: true,
      isbind: false,
      provider: 'wechat',
      show: false,
      countdown: 0,
      fileList: [],
      files: {
        name: '',
        type: ''
      },
      headerImage: null,
      picValue: null,
      upImgUrl: '',
      data: {
        office: '',
        nickname: '',
        mobile: '',
        avatar: '',
        motto: ''
      },
      Orientation: '',
      rules: {
        name: [{
          required: true,
          message: '请输入名称'
        }],
        nickname: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback('请输入昵称')
            } else if (/^[(a-zA-Z0-9\u4e00-\u9fa5){1}_]{1,6}$/.test(value)) {
              callback()
            } else {
              callback('1-6位汉字数字字母下划线组成')
            }
          }
        }]
      }
    }
  },
  computed: {
  },
  async created() {
    await this.personal()
    await this.obtacon()
  },
  methods: {
    personal() { // 获取个人信息
      httpClient.get('/me').then(res => {
        if (res.code === 200) {
          const meInfo = res.data
          this.data.office = meInfo.office
          this.data.nickname = meInfo.nickname
          this.data.mobile = meInfo.mobile
          this.data.avatar = meInfo.avatar
          this.data.motto = meInfo.motto
        } else {
          if (res.code === 401) {
            Toast('身份过期，请重新登录')
            localStorage.clear()
            this.$router.replace({
              path: '/user/sign',
              query: {
                queryname: 'we_chart'
              }
            })
          } else {
            Toast('请求错误' + res.msg)
          }
        }
      }).catch(error => {
        Toast('未知错误' + error.msg)
      })
    },
    submit: async function() {
      // 如果不符合登录条件则不会继续执行
      if (
        this.data.nickname.trim() === '' &&
          this.data.office.trim() === '' &&
          this.data.mobile.trim() === '' &&
          this.data.avatar.trim() === '' &&
          this.data.motto.trim() === ''
      ) {
        return Toast('输入不能为空')
      }
      this.loadShow = false
      const resp = await httpClient.put('/me', this.data)
      if (resp.code !== 200) {
        Toast(resp.msg)
        return
      }
      setTimeout(() => {
        Toast('信息修改成功')
        this.loadShow = true
        this.$router.push('/user')
      }, 1000)
    },
    async submitPic(file) {
      this.loadShow = false
      this.files.name = file.file.name // 获取文件名
      this.files.type = file.file.type // 获取类型
      this.picValue = file.file // 文件流
      this.imgPreview(this.picValue)
    },
    // 处理图片
    imgPreview(file) {
      const self = this
      let Orientation
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, 'Orientation')
      })

      // 看支持不支持FileReader
      if (!file || !window.FileReader) return
      if (/^image/.test(file.type)) {
        // 创建一个reader
        const reader = new FileReader()
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function() {
          const result = this.result
          const img = new Image()
          img.src = result
          // 判断图片是否大于500K,是就直接上传，反之压缩图片
          if (this.result.length <= 500 * 1024) {
            self.headerImage = this.result
            self.postImg()
          } else {
            img.onload = function() {
              const data = self.compress(img, Orientation)
              self.headerImage = data
              self.postImg()
            }
          }
        }
      }
    },
    // 压缩图片
    compress(img, Orientation) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      // 瓦片canvas
      const tCanvas = document.createElement('canvas')
      const tctx = tCanvas.getContext('2d')
      // let initSize = img.src.length;
      let width = img.width
      let height = img.height
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio
      if ((ratio = (width * height) / 4000000) > 1) {
        // console.log("大于400万像素");
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      //    铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // 如果图片像素大于100万则使用瓦片绘制
      let count
      if ((count = (width * height) / 1000000) > 1) {
        // console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
        //      计算每块瓦片的宽和高
        const nw = ~~(width / count)
        const nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      // console.log(this.fileList)
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      // 修复安卓上传图片的时候 被旋转的问题
      if (isAndroid) {
        if (Orientation !== '' && Orientation !== 1) {
          switch (Orientation) {
            case 6: // 需要顺时针（向左）90度旋转
              this.rotateImg(img, 'left', canvas)
              break
            case 8: // 需要逆时针（向右）90度旋转
              this.rotateImg(img, 'right', canvas)
              break
            case 3: // 需要180度旋转
              this.rotateImg(img, 'right', canvas) // 转两次
              this.rotateImg(img, 'right', canvas)
              break
          }
        }
      }
      // 进行最小压缩
      const ndata = canvas.toDataURL('image/jpeg', 0.1)
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return ndata
    },
    // 旋转图片
    rotateImg(img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0
      const max_step = 3
      if (img == null) return
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      console.log(img)
      const height = img.height
      const width = img.width
      let step = 2
      if (step == null) {
        step = min_step
      }
      if (direction === 'right') {
        step++
        // 旋转到原位置，即超过最大值
        step > max_step && (step = min_step)
      } else {
        step--
        step < min_step && (step = max_step)
      }
      // 旋转角度以弧度值为参数
      const degree = (step * 90 * Math.PI) / 180
      const ctx = canvas.getContext('2d')
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0)
          break
      }
    },
    // 将base64转换为文件
    dataURLtoFile(dataurl) {
      var arr = dataurl.split(',')
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], this.files.name, {
        type: this.files.type
      })
    },
    // 这里写接口
    async postImg() {
      const file = this.dataURLtoFile(this.headerImage)
      const formData = new window.FormData()
      formData.append('file', file)
      const res = await httpClient.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.code === 200) {
        this.data.avatar = res.data.sourceUrl
        httpClient.put('/me', this.data).then((resp) => {
          if (resp.code !== 200) {
            Toast(resp.msg)
            return
          }
          setTimeout(() => {
            Toast('图片修改成功')
            this.loadShow = true
          }, 500)
        })
      } else {
        Toast('图片上传失败')
      }
    },
    bindcl: async function() {
      if (this.isbind) {
        await this.delcon()
        this.isbind = false
      } else {
        await this.wechat_sign()
        this.isbind = this.$route.query.callbind
      }
    },
    // 解绑微信
    delcon() {
      httpClient
        .delete('/connects/' + this.provider)
        .then((res) => {
          if (res.code === 200) {
            Toast('解绑成功')
          } else {
            Toast('res.msg')
          }
        })
        .catch((error) => {
          Toast(error.msg)
        })
    },
    // 获取微信绑定
    obtacon() {
      httpClient
        .get('/connects')
        .then((res) => {
          console.log(res)
          if (res.code === 200) {
            if (res.data.length >= 1) {
              this.isbind = true
            } else {
              this.isbind = false
            }
          } else {
            Toast('res.msg')
          }
        })
        .catch((error) => {
          Toast(error.msg)
        })
    },
    // 微信登录
    async wechat_sign() {
      const res = await httpClient.get('oauth/login')
      if (res.code !== 200) {
        return
      }
      window.location = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.logcellm {
  position: relative;
  background-color: #f8f8fa;

  .van-cell {
    margin: 0;
    padding-left: 8%;
    padding-right: 8%;
    width: 100%;
    background-color: #f8f8fa;
    border-bottom: 1px solid #e6e6e6;
  }

  .van-field__control {
    width: 45%;
    margin-left: 50%;
  }

  .van-field__left-icon {
    span {
      padding-left: 5px;
      font-size: 14px;
      color: #625d5c;
    }

    i {
      font-size: 16px;
      color: #625d5c;
    }
  }

  .van-field__error-message {
    text-align: right;
  }
}

.gasoline-morecns {
  height: 50px;
  display: flex;
  padding: 7px 8%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;

  .gasoline-moreones {
    span {
      padding-left: 5px;
      font-size: 14px;
      color: #625d5c;
    }

    i {
      font-size: 16px;
      color: #625d5c;
    }
  }

  .gasoline-moretwos {
    p {
      font-size: 13px;
      float: left;
      margin-right: 15px;
    }

    i {
      font-size: 15px;
    }

    .opinups {
      background: #ffffff;
      width: 40px;
      height: 40px;

      .van-uploader {
        width: 40px;
        height: 40px;
      }
    }
  }
}

.opinder ::v-deep .van-uploader__wrapper {
  //穿透
  width: 40px;
  height: 40px;

  .van-uploader__upload {
    width: 40px;
    height: 40px;
    margin: 0;
  }
}

::v-deep .van-uploader__preview-image {
  width: 40px;
  height: 40px;
}

::v-deep .logcellm i {
  margin-right: 0;
}

::v-deep .van-field__error-message {
  text-align: right;
}

.logva {
  background: #ffffff;
  color: #e63442;
  border: 1px solid #e63442;
  border-radius: 5px;
  font-size: 12px;
  height: 24px;
}

::v-deep .van-icon-chat-o::before {
  padding-right: 5px;
  font-size: 16px;
  color: #625d5c;
}

.pad-all {
  margin-top: 30px;

  .van-button--primary {
    border: none;
    width: 84%;
    margin: 0 8%;
    font-size: 14px;
  }
}
::v-deep .van-loading {
  z-index: 999;
  position: fixed;
  top: 40%;
  left: 40%;
}
</style>
