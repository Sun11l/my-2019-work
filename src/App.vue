<template>
  <div id="app" @click='click'>
    <router-view/>
  </div>
</template>

<script>
import { drawCharImage } from '@/utils'
export default {
  name: 'App',
  mounted () {
    drawCharImage()
  },
  methods: {
    click () {
      // 防止token退出后，登录页面点击页面时触发refreshToken操作
      if (this.$route.name === 'Login') {
        return false
      }
      const base = 25
      const expires = parseInt(this.$store.getters.expireTime)
      let current = new Date().getTime()
      if (expires - current < base * 60 * 1000) {
        this.$store.dispatch('user/refreshToken', this.$store.getters.token)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  line-height: 1;
  font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
  -webkit-tap-highlight-color: transparent;
  background: $colorBackground;
  color: $color-text;
}
</style>
