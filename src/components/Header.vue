<template>
  <div style="height:50px;">
    <van-nav-bar
      :title="$route.meta.title"
      left-text=""
      left-arrow
      :z-index="999"
      @click-left="onBack"
    >
      <template #right>
        <div v-if='false'>
          <van-icon
            style="font-style: normal"
            name='geren'
            class-prefix="icongengduo"
            size="18"
          />
        </div>
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
export default {
  name: 'HeaderNav',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    onBack() {
      history.back()
    },
    userInfo() {
    }
  }
}
</script>
<style lang='scss' scoped>
.van-nav-bar {
  //background: url(../../assets/images/user-title.png) no-repeat;
  background-size: 100% 100%;
  width: 100%;
  position: fixed;
  z-index: 999;
  top: 0;
  background: rgb(88, 141, 219);
}
::v-deep .van-nav-bar .van-icon{
  color: #fff;
}
::v-deep .van-nav-bar__title {
  color: #fff;
}
@font-face {
  font-family: 'icongengduo';
  src: url('../assets/iconfont/iconfont.ttf') format('truetype');
}

.icongengduo {
  font-family: 'icongengduo';
}
.icongengduo:before {
  content: '\e60b';
}
</style>
