<!--  -->
<template>
  <div
    class="loginHead"
    :style="'min-height:'+heightGround+'px'"
  >
    <div class="signbox">
      <div class="sign_head"><img
          :src="headImg"
          alt=""
        ></div>
      <van-cell-group class="logcell">
        <van-field
          v-show="loginSwitchs"
          placeholder="手机号码"
          type="tel"
          v-model="data.mobile"
          maxlength='11'
        >
          <template #left-icon>
            <i class="iconfont iconshoujihao"></i>
          </template>
        </van-field>
        <van-field
          v-show="!loginSwitchs"
          placeholder="账号"
          v-model="data.mobile2"
          maxlength='11'
        >
          <template #left-icon>
            <i class="iconfont iconshoujihao"></i>
          </template>
        </van-field>
        <van-field
          v-show="loginSwitchs"
          center
          type="password"
          v-model="data.code"
          placeholder="请输入验证码"
          icon="clear"
          :error-message="errorMsg.code"
          @click-icon="data.code = ''"
          maxlength='6'
        >
          <template #left-icon>
            <i class="iconfont iconmima"></i>
          </template>
          <van-button
            class="logva"
            slot="button"
            size="small"
            :disabled="countdown > 0"
            @click="sendMobileCode"
            type="primary"
          >
            {{ countdown ? countdown + 's' : '获取验证码'}}
          </van-button>
        </van-field>
        <van-field
          v-show="!loginSwitchs"
          placeholder="登录密码"
          type="password"
          v-model="data.password"
          maxlength='16'
        >
          <template #left-icon>
            <i class="iconfont iconmima"></i>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <div class="signs">
      <span
        v-if='false'
        @click="jump"
      >立即注册</span>
      <span @click="loginSwitch">{{loginSwitchs?'账号密码登录':'验证码登录'}}</span>
    </div>
    <div class="pad-alls mar-top">
      <van-button
        round
        @click="submit"
        block
      >
        登录并绑定
      </van-button>
    </div>

    <!-- <div class="xipa">
      <van-divider :style="{ color: '#fff'}">OR</van-divider>
    </div>
    <div class="othericon">
      <van-button
        @click="wechat_sign"
        round
        plain
        type="primary"
      ><i class="iconfont iconweixin"> </i><span>微信登录</span><i></i></van-button>
    </div> -->
  </div>
</template>

<script>
import {
  Toast
} from 'vant'
import {
  mapMutations
} from 'vuex'
import httpClient from '../../utils/request'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      loginSwitchs: false,
      heightGround: 667,
      headImg: require('../../assets/headover.jpg'),
      countdown: 0,
      data: {
        username: '',
        mobile: '',
        code: '',
        mobile2: '',
        password: ''
      },
      errorMsg: {
        nickname: '',
        mobile: '',
        code: ''
      },
      error_text: '',
      formId: '148fe1e5-673a-4656-8412-364ff92f7d52'
    }
  },
  created() {
    console.log(this.$route)
    this.heightGround = window.screen.height
    // if (this.$route.query.queryname !== 'we_chart') {
    //   this.wechat_sign()
    // }
  },
  components: {},
  methods: {
    ...mapMutations(['changeLogin']),
    async submit() { // 点击登录
      // 如果不符合登录条件则不会继续执行
      if (this.loginSwitchs && (this.data.mobile.trim() === '' || this.data.code.trim() === '')) {
        return Toast('输入不能为空')
      }
      if (!this.loginSwitchs && (this.data.mobile2.trim() === '' || this.data.password.trim() === '')) {
        return Toast('输入不能为空')
      }
      if (this.loginSwitchs && !this.data.mobile.match(/^[1][3,5,6,7,8,9][0-9]{9}$/)) {
        return Toast('请输入正确的手机号码')
      }
      if (this.loginSwitchs && !this.data.code.match()) {
        return Toast('验证码最大为6位')
      }
      localStorage.clear()
      let res
      if (this.loginSwitchs) {
        res = await httpClient.post('/auth/code', {
          mobile: this.data.mobile,
          code: this.data.code
        })
        console.log(res)

        if (res.code !== 200) {
          // this.getquan(res.msg)
          Toast(res.msg)
          return
        }
        this.userToken = 'Bearer ' + res.data.token
      } else {
        res = await httpClient.post('/auth/login', {
          username: this.data.mobile2,
          password: this.data.password
        })
        console.log(res)
        if (res.code !== 200) {
          // this.getquan(res.msg)
          Toast(res.msg)
          return
        }
        this.userToken = 'Bearer ' + res.data
      }
      localStorage.setItem('authorization', this.userToken)
      const unionId = Cookies.get('unionId')
      await this.personal()
      if (unionId && await this.connect(unionId)) {
        // if(isCengban){
        //   this.$router.push('/cengban-list');
        // }else{
        //   this.$router.push('/item');
        // }
        this.$router.push('/')
        Toast('登录并绑定账号成功')
      } else {
        // if(isCengban){
        //   this.$router.push('/cengban-list');
        // }else{
        //   this.$router.push('/item');
        // }
        this.$router.push('/')
        Toast('登录成功')
      }
      Cookies.remove('unionId')
      // this.$router.push('/mine/signlook')
    },
    async getquan(text) {
      const resp = await httpClient.get('/reports/query', {
        params: {
          tel: this.loginSwitchs ? this.data.mobile : this.data.mobile2,
          _from: 'public',
          formId: this.formId
        } // 搜索参数对象
      })
      console.log(resp)
      if (resp.code !== 200) {
        this.error_text = resp.msg
        return false
      }
      const quans = resp.data.content
      if (quans.length > 0) {
        switch (quans[0].status) {
          case 0:
            this.error_text = '用户信息还未审核，请耐心等待！'
            break
          case 5:
            this.error_text = '用户信息正在审核，请耐心等待！'
            break
          case -5:
            if (quans[0].processes.length > 0) {
              this.error_text = `用户信息已被驳回，请重新注册！驳回原因：${quans[0].processes[0].message}`
            } else {
              this.error_text = '用户信息已被驳回，请重新注册！'
            }
            break
          case 10:
            this.error_text = text
            break
        }
        Toast({
          icon: 'error',
          message: this.error_text
        })
      } else {
        Toast({
          icon: 'error',
          message: text
        })
      }
    },
    connect: async function(unionId) {
      const res = await httpClient.post('connects', {
        provider: 'wechat',
        openId: unionId
      })
      return res.code === 200
    },
    async personal() { // 获取个人信息
      const res = await httpClient.get('/me')
      if (res.code === 200) {
        // 判断是否管理员
        const meInfo = res.data
        const isAdmin = meInfo.roles.includes('ROLE_ADMIN') || meInfo.roles.includes('ROLE_SITE_ADMIN')
        const isLingdao = meInfo.roles.includes('ROLE_LINGDAO') && meInfo.roles.includes('ROLE_SITE_ADMIN')
        const isCengban = meInfo.roles.includes('ROLE_CBDW')
        // 领导级别高
        if (isLingdao) {
          localStorage.isAdmin = false
        } else {
          localStorage.isAdmin = isAdmin
        }
        localStorage.isCengban = isCengban
        localStorage.isLingdao = isLingdao
        console.log(isCengban)

        if (isCengban) {
          return true
        } else {
          return false
        }
      } else {
        if (res.code === 401) {
          Toast('身份过期，请重新登录')
        } else {
          Toast('请求错误' + res.msg)
        }
      }
    },
    sendMobileCode() {
      if (this.data.mobile.trim() === '') {
        return Toast('输入不能为空')
      }
      // /^[1][3,5,6,7,8,9][0-9]{9}$/
      if (!this.data.mobile.match(/^[1][3,5,6,7,8,9][0-9]{9}$/)) {
        return Toast('请输入正确的手机号码')
      }
      httpClient.post('/sms', {
        mobile: this.data.mobile,
        usage: 'login'
      }).then((res) => {
        console.log(res)
        var code = res.code
        if (code === 200) {
          Toast('发送成功')
          this.countdown = 60
          this.countdownSubtract()
        } else {
          if (code === 400) {
            Toast(res.msg)
          } else {
            Toast('发送失败，' + res.msg)
          }
        }
      }).catch(error => {
        if (!error.code) {
          Toast('服务器无响应')
        } else {
          Toast(error.msg)
        }
      })
    },
    countdownSubtract() {
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown -= 1
          this.countdownSubtract()
        }, 1000)
      }
    },
    // 微信登录
    async wechat_sign() {
      // console.log('hi')
      const res = await httpClient.get('oauth/login')
      console.log(res)
      if (res.code !== 200) {
        return
      }
      window.location = res.data
    },
    // 跳验证码登录
    jump() {
      this.$router.push('/mine/personal1')
    },
    loginSwitch() {
      this.loginSwitchs = !this.loginSwitchs
    }
  }
}
</script>

<style lang="scss" scoped>
.loginHead {
  background: url('../../assets/backdrop.png') no-repeat;
  background-size: 100% 100%;
}
.signbox {
  padding: 0 10%;
}

.sign_head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;

  img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
  }
}

.logcell {
  .van-field {
    color: #fff;
    font-size: 13px;
    border-bottom: 1px solid #fff;

    .van-field__left-icon {
      i {
        font-size: 15px;
        margin-right: 10px;
      }
    }
  }
}

::v-deep .van-hairline--top-bottom::after {
  border: 0;
}

.pad-alls {
  .van-button--block {
    background-color: transparent;
    border: none;
    width: 80%;
    margin: 0 10%;
    color: #fff;
    font-size: 15px;
    border: 1px solid #ffffff;
  }
}

.forget {
  padding-top: 20px;
  margin: 0 8%;
  font-size: 13px;
  color: #1abc9c;
  display: flex;
  justify-content: flex-end;
}

.xipa {
  margin-top: 40px;
}

.othericon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .van-button--primary {
    width: 80%;
    color: #fff;
    border: 1px solid #fff;
  }

  i {
    font-size: 20px;
    color: #04be01;
  }
  span {
    color: #04be01;
  }

  .van-button__text {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.logva {
  background-color: #fff;
  color: #ff950b;
  font-weight: 600;
  border: #fff;
}
.signs {
  padding: 0 10%;
  display: flex;
  justify-content: flex-end;
  height: 50px;
  span {
    line-height: 50px;
    color: #fff;
    font-size: 15px;
  }
}

::v-deep .van-field__control {
  font-size: 18px;
  color: #fff;
}
::v-deep .van-cell-group {
  background-color: transparent;
  .van-cell {
    background-color: transparent;
  }
}
</style>
