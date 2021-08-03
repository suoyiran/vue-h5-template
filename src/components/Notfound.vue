<template>
  <div id="notfound">
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
#notfound {
  background: url('../assets/404.png');
  background-size: 100% 100%;
  height: 100%;
  position: fixed;
  width: 100%;
}

::v-deep .van-button--primary {
  border-color: black;
  color: black;
  //透明
  display: block;
  background: transparent;
  position: absolute;
  top: 55%;
  right: 0%;
  left: 0%;
  margin: auto;
  width: 90px;
  height: 25px;
  border-radius: 50px;
}
</style>
