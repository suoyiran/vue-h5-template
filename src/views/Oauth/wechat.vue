<template>
  <div>
    微信登录中
  </div>
</template>

<script>
import httpClient from '../../utils/request'
export default {
  async mounted() {
    const res = await httpClient.get('oauth/login')
    console.log(res)
    if (res.code !== 200) {
      return
    }
    window.location = res.data
  }
}
</script>
