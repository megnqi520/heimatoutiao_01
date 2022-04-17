import request from '@/utils/request'

// 获取搜索建议列表数据的 API
export const getSuggestListAPI = kw => {
  return request.get('/v1_0/suggestion', {
    params: {
      q: kw
    }
  })
}

// 封装搜索结果的API
export const getSearchResultAPI = (kw, page) => {
  return request.get('/v1_0/search', {
    params: {
      q: kw, // 搜索关键词
      page // 页码值
    }
  })
}
