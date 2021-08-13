<template>
  <div>
    <Header />
    <div class="box_cus">
      <van-cell-group class="logcells">
        <van-field
          type="password"
          placeholder="请输入旧密码"
          v-model="data.password"
          maxlength='16'
        >
          <template #left-icon>
            <i class="iconfont icon-mima"></i>
          </template>
        </van-field>
        <van-field
          type="password"
          placeholder="请输入新密码"
          v-model="data.password2"
          maxlength='16'
        >
          <template #left-icon>
            <i class="iconfont icon-mima"></i>
          </template>
        </van-field>
        <van-field
          type="password"
          placeholder="请再次确认新密码"
          v-model="data.password3"
          maxlength='16'
        >
          <template #left-icon>
            <i class="iconfont icon-mima"></i>
          </template>
        </van-field>
      </van-cell-group>
      <div class="pad-all mar-top">
        <van-button
          round
          block
          type="primary"
          @click="submit"
        >
          重置密码
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Toast
} from 'vant'
import httpClient from '../../utils/request'
export default {
  components: {
    Header: () => import('../../components/Header')
  },
  data() {
    return {
      data: {
        password: '',
        password2: '',
        password3: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入名称'
        }]
      }
    }
  },
  methods: {
    submit() {
      // 如果不符合登录条件则不会继续执行
      if (this.data.password.trim() === '' || this.data.password2.trim() === '' || this.data.password3.trim() === '') {
        return Toast('输入不能为空')
      }
      if (this.data.password2 !== this.data.password3) {
        return Toast('新密码两次输入不一致')
      }
      // /^[1][3,5,6,7,8,9][0-9]{9}$/
      if (!this.data.password.match()) {
        return Toast('旧密码问题')
      }
      if (!this.data.password2.match()) {
        return Toast('新密码问题')
      }
      httpClient.put('/password', {
        oldPassword: this.data.password,
        password: this.data.password3
      }).then((res) => {
        console.log(res)
        var code = res.code
        if (code === 200) {
          Toast('修改成功')
        } else {
          Toast(res.data.msg + ', 请重新修改')
        }
      }).catch((error) => {
        console.log(error.code)
        if (error.code === 403) {
          Toast('原密码错误')
        } else {
          Toast(error.code + '请重新修改')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.logcells {

  .van-cell {
    width: 84%;
    padding: 10px 0;
    margin: 0 8%;
    border-bottom: 1px solid #ececec;
    font-size: 15px;
  }

  i {
    margin-right: 10px;
    font-size: 14px;
  }
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

.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border: none;
}

.van-button--normal {
  padding: 0;
}

.box_cus {
  position: relative;
}
</style>
