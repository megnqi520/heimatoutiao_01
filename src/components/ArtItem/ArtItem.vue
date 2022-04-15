<template>
  <div>
    <!-- 文章的信息 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 单张图片 -->
          <img alt="" class="thumb" v-if="article.cover.type === 1" v-lazy="article.cover.images[0]">
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img alt="" class="thumb" v-for="(item, i) in article.cover.images" :key="i" v-lazy="item">
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>作者 {{ article.aut_name }}&nbsp;&nbsp; {{ article.comm_count }} 评论 &nbsp;&nbsp; 发布日期 {{ article.pubdate | dateFormat }}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="show1 = true"/>
        </div>
      </template>
    </van-cell>

    <!-- 反馈的动作面板 -->
    <!-- <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="isFirst = true"> -->
      <!-- 第一级反馈面板 -->
      <!-- <div v-if="isFirst">
        <van-cell :title="item.name" clickable class="center-title" v-for="item in actions" :key="item.name" @click="onCellClick(item.name)"/>
      </div> -->
      <!-- 第二级反馈面板 -->
      <!-- <div v-else>
      <van-cell cancel-text="返回" clickable title-class="center-title" @click="isFirst = true" />
      <van-cell :title="item.label" clickable title-class="center-title" v-for="item in reports" :key="item.type" />
    </div>
    </van-action-sheet> -->
    <!-- 第一级反馈面板 -->
    <van-action-sheet v-model="show1" :actions="actions" cancel-text="取消" close-on-click-action get-container="body" @select="onSelect1"/>
    <!-- 第二级反馈面板 -->
    <van-action-sheet v-model="show2" :actions="reports" cancel-text="返回" close-on-click-action get-container="body" @cancel="onCancel" @select="onSelect2"/>
  </div>
</template>

<script>
import reports from '@/api/reports'
import { dislikeArticleAPI, reportArticleAPI } from '@/api/homeAPI'

export default {
  name: 'ArtItem',
  props: {
    // 文章的信息对象
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 是否展示反馈面板
      show1: false,
      show2: false,
      // 第一个面板的可选项列表
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 第二个面板的可选项列表，数组中每一项的格式 { id, name }
      reports
    }
  },
  methods: {
    async onSelect1(item) {
      if (item.name === '不感兴趣') {
        // 调用 API 接口，将文章设置为不感兴趣
        const { data: res } = await dislikeArticleAPI(this.artId)
        if (res.message === 'OK') {
          // TODO 炸楼操作
          this.$emit('remove-article', this.artId)
        }
      } else if (item.name === '拉黑作者') {
        console.log('拉黑作者')
      } else if (item.name === '反馈垃圾内容') {
        // TODO：展示二级反馈面板
        this.show2 = true
      }
    },
    onCancel() {
      this.show1 = true
    },
    async onSelect2(item) {
      const { data: res } = await reportArticleAPI(this.artId, item.value)
      if (res.message === 'OK') {
        this.$emit('remove-article', this.artId)
      }
    }
  },
  computed: {
    // 文章 Id 的计算属性
    artId() {
      // 注意：文章对象的 art_id 是大数对象，需要调用 .toString() 方法转换为字符串形式
      return this.article.art_id.toString()
    }
  }
}
</script>

<style lang="less" scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}
.center-title {
  text-align: center;
}
</style>
