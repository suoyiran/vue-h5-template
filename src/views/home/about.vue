<!-- home -->
<template>
  <div class="about-container">
    <div class="warpper">
      <div class="list">
        <div class="logo"></div>
        <div class="demo-home__title">VUE H5开发模板</div>
        <div
          class="item"
          v-copy='name'
        >
          {{'ppp'}}
        </div>
        <div class="item">{{10 | stateToName}}<i class="iconfont icon-ziyuan"></i></div>

        <div class="wechat">
          <img
            :src="this.wechat"
            alt=""
          />
        </div>
        <div class="item">关注公众号：回复“加群”即可加 前端仙女群</div>
        <div class="item">
          {{ userName }}
          <van-button
            v-if="userName == ''"
            type="warning"
            size="small"
            @click="doDispatch('13203223333')"
          >快点我~</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 请求接口
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      wechat: `${this.$cdn}/wx/640.gif`,
      name: '999'
    }
  },
  computed: {
    ...mapGetters(['userName'])
  },
  mounted() {
    console.log(this.$api)

    this.initData()
  },
  methods: {
    // 请求数据案例
    initData() {
    },
    // Action 通过 store.dispatch 方法触发
    doDispatch(i) {
    },
    goGithub(index) {
      window.location.href = 'https://github.com/sunniejs/vue-h5-template'
    }
  }
}
</script>
<style lang="scss">
.about-container {
  /* 你的命名空间 */
  background: #fff;
  height: 100vh;
  box-sizing: border-box;
  .warpper {
    padding: 50px 12px 12px 12px;
    .list {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #666;
      font-size: 14px;
      .demo-home__title {
        margin: 0 0 6px;
        font-size: 32px;
        .demo-home__title img,
        .demo-home__title span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .item {
        @include textoverflow(2);
        font-size: 14px;
        line-height: 34px;
        a {
          text-decoration: underline;
        }
        .van-button {
          /* vant-ui 元素*/
          background: #ff5500;
        }
      }

      .logo {
        width: 120px;
        height: 120px;
        background: url($cdn + '/weapp/logo.png') center / contain no-repeat;
      }
      .wechat {
        width: 200px;
        height: 200px;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
</style>
