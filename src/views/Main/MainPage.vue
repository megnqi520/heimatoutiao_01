<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- 底部的 TabBar -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'MainPage'
}
</script>

<style lang="less" scope>

</style>
