import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index'
import router from '@/router/index.js'
import { exchangeTokenAPI } from '@/api/userAPI.js'

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 获取 token 的值
    const tokenStr = store.state.tokenInfo.token
    // 判断 stokenStr 的值是否为空
    if (tokenStr) {
      // 添加身份认证字段
      config.headers.Authorization = `Bearer ${tokenStr}`
    }

    // 展示 loading 效果
    Toast.loading({
      message: '加载中...', // 文本内容
      duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
    })
    return config
  },
  error => {
    // 对请求错误做些什么

    // 在请求失败的时候,关闭 loading 提示效果
    Toast.clear()

    // 如果有响应的结果,并且响应的状态码是 401, 则证明 Token 过期了
    if (error.response && error.response.status === 401) {
      console.log('token 过期啦')
      // TODO1：清空 vuex 和 localStorage 中的数据
      store.commit('cleanState')
      // TODO2：强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
      router.replace('/login?pre=' + router.currentRoute.fullPath)
    }

    // Promise.reject()方法返回一个带有拒绝原因的Promise对象
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 效果
    Toast.clear()
    return response
  },
  async error => {
    // 对响应错误做些什么

    Toast.clear()
    // 1.从 vuex 中获取 tokenInfo 对象: {token, refresh_token}
    const tokenInfo = store.state.tokenInfo

    // 2.判断是否为 token 过期
    if (error.response && error.response.status === 401 && tokenInfo.refresh_token) {
      // token 过期
      console.log('token 过期啦')
      try {
        // 3.1 发起请求, 根据 refresh_token 重新请求一个有效的新 token
        const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
        console.log(res)
        // 3.2 更新 Store 中的 Token
        store.commit('updateTokenInfo', { token: res.data.token, refresh_token: tokenInfo.refresh_token })
        // 3.3 重新调用刚才“请求未遂”的接口
        // 3.3.1 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
        return instance(error.config)
      } catch {
        // token 和 refresh_token 都失效了

        // 4.1 清空 vuex 和 localStroage
        store.commit('cleanState')
        // 4.2 强值跳转到登录页
        router.replace('/login?pre=' + router.currentRoute.fullPath)
      }
    }

    return Promise.reject(error)
  }
)

export default instance
