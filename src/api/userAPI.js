import request from '@/utils/request.js'
import axios from 'axios'

// 换取 Token 的 API(形参中的 refreshToken 用来换取新 token)
export const exchangeTokenAPI = refreshToken => {
  return axios({
    method: 'PUT',
    url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
    headers: {
      Authorization: 'Bearer ' + refreshToken
    }
  })
}

// 登录的 API 接口
export const loginAPI = data => {
  return request.post('/v1_0/authorizations', data)
}

// 请求用户基本信息的 API
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}

// 请求用户简介信息的 API
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}

// 修改用户简介信息的 API
// 可能的格式有以下两种：
// { name: 'xxx' } 或 { birthday: '2012-12-12' }
export const updateUserProfileAPI = obj => {
  return request.patch('/v1_0/user/profile', obj)
}

// 修改头像的 API (形参中的 fd 表示 FormDate 格式的表单数据)
export const updateUserAvatarAPI = fd => {
  return request.patch('/v1_0/user/photo', fd)
}
