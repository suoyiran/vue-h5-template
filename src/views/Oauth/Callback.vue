<template>
  <div class="loading">
    <van-loading
      type="spinner"
      color="#0094ff"
      size="50px"
      vertical
    >
      登录中...
    </van-loading>
    {{ user }}
  </div>
</template>

<script>
import httpClient from '../../utils/request'
import { Toast } from 'vant'
import Cookies from 'js-cookie'

export default {
  data: () => ({
    user: '',
    openId: ''
  }),
  mounted() {
    // 获取回调地址的参数
    const query = this.$route.query
    // 用回调地址参数向授权接口换取用户信息
    httpClient.get('oauth/callback', {
      params: {
        code: query.code,
        state: query.state
      }
    })
      .then(res => {
        this.openId = res.data.openId
        if (res.code === 200) {
          localStorage.authorization = 'Bearer ' + res.data
          this.personal()
          // 跳转至首页
          this.$router.push('/page/home')
          // 停止后续程序执行
          return
        } else if (res.code === 201) {
          // 未获取到Token，说明用户未注册，引导用户去注册？
          if (localStorage.authorization) {
            httpClient.post('/connects', {
              openId: this.openId,
              provider: 'wechat'
            }).then((res) => {
              if (res.code === 200) {
                Toast('绑定成功')
                this.$router.push({
                  path: '/page/home'
                })
              } else {
                Toast(res.msg)
                this.$router.push({
                  path: '/user/sign'
                })
              }
            }).catch(err => {
              Toast(err.msg)
              this.$router.push({
                path: '/user/sign',
                query: {
                  openId: this.openId
                }
              })
            })
          } else {
            Toast('微信认证成功，请绑定账号')
            const user = res.data
            Cookies.set('unionId', user.openId, {
              // 有效期10分钟
              expires: new Date(Date() * 1 + 10 * 60 * 1000)
            })
            this.$router.push({
              path: '/user/sign',
              query: {
                openId: this.openId
              }
            })
          }
        } else {
          Toast('登录失败:' + res.msg)
        }
      })
  },
  methods: {
    personal() { // 获取个人信息
      httpClient.get('/me').then(res => {
        if (res.code === 200) {
          const meInfo = res.data
          const isAdmin = meInfo.roles.includes('ROLE_ADMIN') || meInfo.roles.includes('ROLE_SITE_ADMIN')
          localStorage.isAdmin = isAdmin
        } else {
          Toast('请求错误' + res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  text-align: center;
  padding-top: 50%;
}
</style>
