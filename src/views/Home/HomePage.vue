<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" @click="$router.push('/search')"/>
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <van-tabs sticky offset-top="1.22666667rem" v-model="active" :before-change="beforeTabsChange" @change="onTabsChange">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name" >
        <art-list :channel-id="item.id" ></art-list>
      </van-tab>
    </van-tabs>

    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" @click="show = true"/>

    <!-- 频道管理的弹出层 -->
    <van-popup v-model="show" :close-on-click-overlay="false" @close="isDel = false">
      <div class="popup-container">

        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon name="cross" size="14" color="white" @click="show = false" />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{ isDel ? '点击移除频道' : '点击进入频道' }}</span>
              </div>
              <span class="btn-edit" @click="isDel = !isDel">{{ isDel ? '完成' : '编辑' }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in userChannel" :key="item.id">
                <!-- 用户的频道 Item 项 -->
                <div class="channel-item van-hairline--surround" @click="onUserChannelClick(item, index)">
                  {{item.name}}
                  <!-- 删除的图标 -->
                  <van-badge color="transparent" class="cross-badge" v-if="isDel && item.name !== '推荐' && userChannel.length > 2">
                    <template #content>
                      <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12"></van-icon>
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannels" :key="item.id">
                <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{item.name}}</div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelAPI, getAllChannelAPI, updateUserChannelAPI } from '@/api/homeAPI'
import ArtList from '@/components/ArtList/ArtList.vue'

// "频道名称"和"滚动条位置"之间的对应关系, 格式 { '推荐': 211, 'html': 30, '开发者资讯': 890 }
const nameToTop = {}

export default {
  name: 'HomePage',
  components: {
    ArtList
  },
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户的频道列表数组
      userChannel: [],
      // 控制频道管理弹出层的展示与隐藏
      show: false,
      // 所有的频道列表数据
      allChannel: [],
      // 频道数据是否处于删除的状态
      isDel: false
    }
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    },
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        this.allChannel = res.data.channels
      }
    },
    // 新增频道
    addChannel(item) {
      this.userChannel.push(item)
      this.updateChannel()
    },
    async updateChannel(item) {
      // 准备要提交到服务器的数据
      const channels = this.userChannel.filter(item => item.name !== '推荐').map((item, index) => {
        return {
          id: item.id,
          seq: index + 1
        }
      })
      // 调用 API 接口
      const { data: res } = await updateUserChannelAPI(channels)
      if (res.message === '更新用户频道成功') {
        // TODO 提示用户更新成功
        // console.log(1)
        this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
      }
    },
    // 从用户频道列表中， 移除指定 id 的频道
    onUserChannelClick(channel, index) {
      if (this.isDel) {
        // 处于删除状态
        // 判断用户点击的是否为'推荐'
        if (channel.name === '推荐' || this.userChannel.length === 2) return

        // 移除频道
        this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
        this.updateChannel()
      } else {
        // 不处于删除状态

        // 修改 Tabs 的激活项的索引值
        this.active = index
        // 关闭 popup 弹出层
        this.show = false
      }
    },
    // tabs 发生切换之前，触发此方法
    beforeTabsChange() {
      // 把当前"频道名称"对应的"滚动条位置"记录到 nameToTop 对象中
      const name = this.userChannel[this.active].name
      nameToTop[name] = window.scrollY

      // return true 表示允许进行标签页的切换
      return true
    },
    // 当 tabs 切换完毕之后，触发此方法
    onTabsChange() {
      // 等 DOM 更新完毕之后，根据记录的"滚动条位置"，调用 window.scrollTo() 方法进行滚动
      this.$nextTick(() => {
        const name = this.userChannel[this.active].name
        window.scrollTo(0, nameToTop[name] || 0)
      })
    }
  },
  created() {
    // 请求用户的频道列表数据
    this.initUserChannel()

    // 请求所有的频道列表数据
    this.initAllChannel()
  },
  computed: {
    // 更多频道的数据
    moreChannels() {
      return this.allChannel.filter(item => {
        // 判断当前循环项，是否在“我的频道”列表之中
        const index = this.userChannel.findIndex(i => i.id === item.id)
        // 如果不在，则 return true  表示需要把这一项存储到返回的新数组之中
        if (index === -1) {
          return true
        } else {
          return false
        }
      })
    }
  },
  // 导航离开该组件的对应路由时调用   可以访问组件实例 `this`
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    next()
  }
}
</script>

<style lang="less" scope>
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;

  .van-tabs__wrap {
    padding-right: 36px;
    background-color: #fff;
  }

  .plus {
    position: fixed;
    top: 58px;
    right: 10px;
    z-index: 999;
  }

  .logo {
    height: 80%;
  }

  .van-popup,
  .popup-container {
    background-color: transparent;
    height: 100%;
    width: 100%;
  }

  .popup-container {
    display: flex;
    flex-direction: column;
  }

  .pop-body {
    flex: 1;
    overflow: auto;
    padding: 8px;
    background-color: white;
  }

  .my-channel-box,
  .more-channel-box {
    .channel-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 28px;
      padding: 0 6px;
      .title-bold {
        font-weight: bold;
      }
      .title-gray {
        color: gray;
        font-size: 12px;
      }
    }
  }

  .btn-edit {
    border: 1px solid #a3a2a2;
    padding: 0 10px;
    line-height: 20px;
    height: 20px;
    border-radius: 6px;
    font-size: 12px;
  }

  .channel-item {
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color: #fafafa;
    margin: 6px;
  }

  .cross-badge {
    position: absolute;
    right: -3px;
    top: 0;
    border: none;
  }

  .sp-line {
    margin: 10px 0 20px 0;
  }
}
</style>
