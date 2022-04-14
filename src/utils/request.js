import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index'

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
      console.log('ok')
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
  error => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)

export default instance
