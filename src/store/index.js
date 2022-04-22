import Vue from 'vue'
import Vuex from 'vuex'

import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI.js'

Vue.use(Vuex)

// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
}

const stateStr = localStorage.getItem('state')

if (stateStr) {
  initState = JSON.parse(stateStr)
}

export default new Vuex.Store({
  // state: {
  //   // 用来存储 token 信息的对象, 将来这个对象中会包含两个属性 { token, refresh_token }
  //   tokenInfo: {}
  // },

  // 为 state 赋初值
  state: initState,
  getters: {
    // 用户头像的计算属性
    userAvatar(state) {
      // 默认的头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

      // 如果用户信息对象中包含 photo 属性的值,则为 imgSrc 重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }

      return imgSrc
    }
  },
  mutations: {
    // 更新 tokenInfo 数据的方法
    updateTokenInfo(state, payload) {
      // 把提交过来的 payload 对象, 作为 tokenInfo 的值
      state.tokenInfo = payload

      // 如果希望在 Mutations A 中 调用 Mutations B ,需要通过 this.commit() 方法来实现
      // this 表示当前的 new 出来的 store 实例对象
      this.commit('saveStateStorage')
    },
    // 将 state 持久化存储到本地
    saveStateStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新 userInfo 的方法
    updateUserInfo(state, payload) {
      // 把用户信息转存到 state 中
      state.userInfo = payload
      // 将最新的 state 对象持久化存储到本地
      this.commit('saveStateStorage')
    },
    // 清空 vuex 和本地的数据
    cleanState(state) {
      // 1.清空 vuex 中的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 2.将清空后的 state 存储到本地
      this.commit('saveStateStorage')
    },
    // 更新用户简介的方法
    updateUserProfile(state, payload) {
      state.userProfile = payload
      this.commit('saveStateStorage')
    }
  },
  actions: {
    async initUserInfo(ctx) {
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        // TODO: 把数据转交给 Mutation 方法 ctx.commit('Mutation方法名')
        ctx.commit('updateUserInfo', res.data)
      }
    },
    // 初始化用户的简介信息
    async initUserProfile(ctx) {
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        // TODO: 把数据转交给 Mutation 方法 ctx.commit('Mutation方法名')
        ctx.commit('updateUserProfile', res.data)
      }
    }
  },
  modules: {
  }
})
