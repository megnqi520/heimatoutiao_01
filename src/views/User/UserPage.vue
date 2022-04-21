<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfo.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{userInfo.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userInfo.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{userInfo.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{userInfo.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link @click="$router.push({name: 'user-edit'})"/>
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat"/>
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'UserPage',
  methods: {
    // 从 vuex 中指定名称的 Action 方法映射到组件中使用
    ...mapActions(['initUserInfo']),
    ...mapMutations(['cleanState']),
    // 点击了退出登录
    async logout() {
      const confirmResult = await this.$dialog.confirm({
        title: '提示',
        message: '确认退出登录吗？'
      }).catch(err => {
        // err 是错误的结果
        // console.log(err)
        // 这里把 err return 给 confirmResult
        return err
      })
      // 点击“确认”按钮时，confirmResult 的值为字符串 confirm
      // 点击“取消”按钮时，confirmResult 的值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult === 'cancel') return true

      // TODO：实现退出的登录操作：
      // 1. 清空 vuex 中的数据
      // 2. 清空本地的数据
      this.cleanState()
      // 3. 跳转到登录页
      this.$router.push('/login')
    }
  },
  created() {
    this.initUserInfo()
  },
  computed: {
    // 从 vuex 中把指定名称的 State 数据映射到组件中使用
    ...mapState(['userInfo'])
  }
}
</script>

<style lang="less" scope>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
