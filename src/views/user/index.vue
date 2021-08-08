<template>
  <div id="mine">
    <header>
      <div class="head_box">
        <div class="row-flex">
          <div>
            <div class="head_img"><img
                @click="jump"
                :src="meInfo.avatar ? meInfo.avatar : require('../../assets/head.jpg')"
                alt=""
              >
            </div>
          </div>
          <div
            class="head2_box"
            @click="jump"
          >
            <h4>{{meInfo.nickname}}</h4><span>{{meInfo.office}} {{meInfo.motto}}</span>
          </div>
        </div>
      </div>

    </header>
    <div class="cellbtn">
      <van-cell-group class="btngrp">
        <van-cell
          is-link
          v-for="flg in flgs"
          :key="flg.id"
          @click="menu(flg.cloli)"
        >
          <template #title>
            <div><i :class="flg.icon1"></i></div>
            <span class="custom-title">{{flg.title2}}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <TabBar />
  </div>
</template>

<script>
import {
  Toast
} from 'vant'
import httpClient from '../../utils/request'
export default {
  components: {
    TabBar: () => import('../../components/TabBar')
  },
  data() {
    return {
      isLoading: false,
      meInfo: {},
      flgs: [
        {
          id: 1,
          number: 0,
          icon1: 'iconfont icon777',
          title2: '个人信息',
          cloli: 'personal'
        },
        {
          id: 2,
          number: 0,
          icon1: 'iconfont iconjiesuo',
          title2: '修改密码',
          cloli: 'password'
        },
        {
          id: 3,
          number: 0,
          icon1: 'iconfont iconkaiguan',
          title2: '退出登录',
          cloli: 'sign'
        }
      ]
    }
  },
  async created() {
    await this.personal()
  },
  methods: {
    menu(e) {
      if (e === 'sign') {
        localStorage.clear()
      }
      this.$router.push(
        {
          path: '/user/' + e,
          query: {
            queryname: 'we_chart'
          }
        })
    },
    personal() { // 获取个人信息
      httpClient.get('/me').then(res => {
        if (res.code === 200) {
          this.meInfo = res.data
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
    // 跳个人信息
    jump() {
      this.$router.push('/user/personal')
    }
  }
}
</script>

<style lang="scss" scoped>
#mine {
  position: relative;
  padding-bottom: 50px;
}

header {
  height: 150px;
  background: url('../../assets/mineHead.png') no-repeat;
  background-size: 100% 100%;
}

.head_box {
  padding-left: 8%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.row-flex {
  display: flex;
  align-items: center;
  color: #ffffff;
}
.head2_box {
  padding-left: 12px;
}
.head2_box h4 {
  display: block;
  font-size: 17px;
}

.head2_box span {
  display: block;
  padding-top: 8px;
  font-weight: Medium;
  font-size: 13px;
}

.head_img {
  height: 75px;
  width: 75px;
}

.head_img img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}

::v-deep .van-cell__title div {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  display: inline-block;
}

::v-deep .van-cell__title div i {
  font-size: 14px;
}

::v-deep .van-cell__title span {
  padding-left: 9px;
  font-size: 14px;
}

::v-deep .van-cell__right-icon {
  font-size: 16px;
}

.cellbtn {
  padding: 15px 10px 20px 10px;
  z-index: 999;
}

.btngrp {
  background-color: transparent;
}

::v-deep .van-cell {
  height: 55px;
  display: flex;
  align-items: center;
}

::v-deep [class*='van-hairline']::after {
  border: 0;
}

::v-deep .van-cell:first-child {
  border-radius: 5px 5px 0 0;
}

::v-deep .van-cell:last-child {
  border-radius: 0 0 5px 5px;
}
</style>
