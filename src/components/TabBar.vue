<template>
  <div class="bottom">
    <van-tabbar
      route
      inactive-color="#999999"
      z-index='999'
    >
      <van-tabbar-item
        v-for='(item,inx) in items'
        :key='inx'
        replace
        :to="item.path"
      >{{item.name}}<template #icon>
          <i :class="'iconfont '+item.icon" />
        </template></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  props: ['number'],
  data() {
    return {
      items: [{ name: '首页', path: '/home', icon: 'iconshouye1-copy' }, { name: '我的', path: '/user', icon: 'iconwodedangxuan' }]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.bottom {
  width: 100%;
  height: 49px;
  color: #999999;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 9999;
  .iconfont {
    font-size: 18px;
  }
}

.bottom-ul {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.bottom-ul > li {
  height: 100%;
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.bottom-ul > li > i {
  font-size: 24px;
}

.bottom-ul > li > span {
  font-size: 12px;
  line-height: 16px;
}
</style>
