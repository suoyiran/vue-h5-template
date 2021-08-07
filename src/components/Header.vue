<template>
  <div style="height:50px;">
    <van-nav-bar
      :title="title"
      left-text=""
      left-arrow
      :z-index="999"
      @click-left="onBack"
    >
      <template #right>
        <div>
          <van-icon
            style="font-style: normal"
            name='geren'
            class-prefix="icon-geren"
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
      title: '标题'
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
}
.van-nav-bar__title {
  color: #fff;
}
.van-icon-arrow-left:before {
  content: '\F008';
  color: #fff;
}
.van-icon-user-o:before {
  content: '\F0CC';
  color: #fff;
  font-size: 0.6rem;
}
@font-face {
  font-family: 'icon-geren';
  src: url('../assets/iconfont/iconfont.ttf') format('truetype');
}

.icon-geren {
  font-family: 'icon-geren';
}
.icon-geren:before {
  content: '\e604';
}
</style>
