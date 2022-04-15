import request from '@/utils/request'

export const getUserChannelAPI = () => {
  return request.get('/v1_0/channels')
}

// 根据频道 Id 请求频道下的文章列表数据
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id, // 频道的 Id
      timestamp: time // 时间戳
    }
  })
}
