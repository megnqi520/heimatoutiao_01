<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item, i) in list" :key="i">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="item.name === 'xs'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{item.msg}}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{item.msg}}</div>
          <van-image fit="cover" round :src="userAvatar" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么..." @keyup="keyup">
        <template #button>
          <span @click="send()" style="font-size:12px;color:#999">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 按需导入 io 方法: 调用 io('url')方法, 即可创建 websocket 连接的实例
import { io } from 'socket.io-client'

// 定义变量 socket 用来接受io()方法创建的 socket 实例
let socket = null

export default {
  name: 'ChatPage',
  data() {
    return {
      // 用户输入的聊天内容
      word: '',
      // 所有的聊天消息
      list: [
        // 1.只根据 name 属性,即可判断出这个消息应该渲染到左侧还是右侧
        // { name: 'xs', msg: 'hi，你好！我是小思' },
        // { name: 'me', msg: '我是编程小王子' }
      ]
    }
  },
  methods: {
    // 提交按钮的点击事件处理函数
    send() {
      // 如果输入的聊天内容为空，则 return 出去
      if (!this.word) return

      // 向服务器发送消息
      socket.emit('send', this.word)
      // 将用户填写的消息存储到 list 数组中
      this.list.push({ name: 'me', msg: this.word })
      // 清空文本框中的消息内容
      this.word = ''
    },
    keyup(e) {
      if (e.code === 'Enter') {
        this.send()
      }
    },
    // 滚动到页面底部
    scrollToBottom() {
      // 1.获取到所有的聊天 Item 项
      const chatItem = document.querySelectorAll('.chat-item')
      // 2.获取到最后一项对应的 DOM 元素
      const lastItem = chatItem[chatItem.length - 1]
      // 3.滚动元素的父容器,使被调用 scrollIntoView() 的元素对用户可见
      lastItem.scrollIntoView({
        // 平缓滑动
        behavior: 'smooth',
        // 定义垂直方向的对齐（end 表示元素的底端将和其所在滚动区的可视区域的底端对齐）
        block: 'end'
      })
    }
  },
  computed: {
    ...mapGetters(['userAvatar'])
  },
  created() {
    // 创建客户端 websocket 的实例
    socket = io('ws://www.liulongbin.top:9999')
    // 建立连接的事件
    socket.on('connect', () => console.log('connect: websocket 连接成功!'))
    // 关闭连接的事件
    socket.on('disconnect', () => console.log('disconnect: websocket 连接关闭!'))

    // 接受到消息的事件
    socket.on('message', msg => {
      this.list.push({ name: 'xs', msg })
    })
  },
  // 组件被销毁之前, 清空 socket 对象
  beforeDestroy() {
    // 关闭连接
    socket.close()
    // 销毁 websocket 实例对象
    socket = null
  },
  watch: {
    list() {
      // 监视到 list 数据变化后，等 DOM 更新完毕，再执行滚动到底部的操作
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
