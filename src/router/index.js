import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login/LoginPage.vue'
import Main from '@/views/Main/MainPage.vue'
import Home from '@/views/Home/HomePage.vue'
import User from '@/views/User/UserPage.vue'
import Search from '@/views/Search/SearchPage.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
import UserEdit from '@/views/UserEdit/UserEdit.vue'

Vue.use(VueRouter)

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
  { path: '/user/edit', component: UserEdit, name: 'user-edit' }
]

const router = new VueRouter({
  routes
})

export default router
