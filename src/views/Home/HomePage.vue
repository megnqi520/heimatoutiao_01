<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <van-tabs sticky offset-top="1.22666667rem" v-model="active" >
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name" >{{ item.name }}</van-tab>
    </van-tabs>

    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
import { getUserChannelAPI } from '@/api/homeAPI'

export default {
  name: 'HomePage',
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户的频道列表数组
      userChannel: []
    }
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    }
  },
  created() {
    this.initUserChannel()
  }
}
</script>

<style lang="less" scope>
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
  .van-tabs__wrap {
    padding-right: 36px;
    background-color: #fff;
  }
  .plus {
    position: fixed;
    top: 58px;
    right: 10px;
    z-index: 999;
  }
}
.logo {
  height: 80%;
}
</style>
