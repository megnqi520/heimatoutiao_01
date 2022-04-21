import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store/index.js'

import Login from '@/views/Login/LoginPage.vue'
import Main from '@/views/Main/MainPage.vue'
import Home from '@/views/Home/HomePage.vue'
import User from '@/views/User/UserPage.vue'
import Search from '@/views/Search/SearchPage.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
import UserEdit from '@/views/UserEdit/UserEdit.vue'
import Chat from '@/views/Chat/ChatPage.vue'

Vue.use(VueRouter)

// 所有权限页面的路径,都在这个数组之中
const pagePathArr = ['/user', '/user/edit']

const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/',
    component: Main,
    children: [
      { path: '', component: Home, name: 'home' },
      { path: 'user', component: User, name: 'user' }
    ]
  },
  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' },
  // 搜索结果页
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  // 文章详情的路由规则
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true },
  // 编辑用户资料的路由规则
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  // 小思聊天的路由规则
  { path: '/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  // 访问的是有权限的页面, 需要判断用户是否登录
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 1.从 store 中获取 token 的值
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      // 1.1 token 有值, 已登录过
      next()
    } else {
      // 1.2 token 不存在, 没有登录
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问的是没有权限的页面
    next()
  }
})

// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}

export default router
