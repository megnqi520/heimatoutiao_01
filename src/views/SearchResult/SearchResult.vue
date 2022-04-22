<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />

    <!-- 文章的 Item 项 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多数据了" @load="onLoad" :immediate-check="false">
      <art-item v-for="item in searchList" :key="item.art_id.toString()" :article="item" :closable="false"></art-item>
    </van-list>
  </div>
</template>

<script>
import { getSearchResultAPI } from '@/api/searchAPI.js'
import ArtItem from '@/components/ArtItem/ArtItem.vue'

export default {
  name: 'SearchResult',
  components: {
    ArtItem
  },
  props: ['kw'],
  data() {
    return {
      // 页码值
      page: 1,
      // 搜索的结果
      searchList: [],
      // 是否正在进行上拉加载的数据请求
      loading: false,
      // 所有数据是否已经加载完毕
      finished: false
    }
  },
  methods: {
  // 获取搜索的结果
    async initSearchList() {
    // 调用 API 接口
      const { data: res } = await getSearchResultAPI(this.kw, this.page)
      if (res.message === 'OK') {
        // 为 searchList 赋值
        // 1.拼接数据
        this.searchList = [...this.searchList, ...res.data.results]
        // 2.将 loading 设置为 false
        this.loading = false
        // 3.判断数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
        // 4.让页码值 +1
        this.page += 1
      }
    },
    // 触发了上拉加载更多
    onLoad() {
      this.initSearchList()
    }
  },
  created() {
    this.initSearchList()
  },
  watch: {
    kw() {
      this.page = 1
      this.searchList = []
      this.loading = false
      this.finished = false

      this.initSearchList()
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    setTimeout(() => {
      next()
    }, 0)
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
