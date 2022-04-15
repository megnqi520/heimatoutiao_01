// 以模块的方式导出"举报文章"时，后端接口约定的举报类型
const reports = [
  {
    value: 0,
    name: '其它问题'
  },
  {
    value: 1,
    name: '标题夸张'
  },
  {
    value: 2,
    name: '低俗色情'
  },
  {
    value: 3,
    name: '错别字多'
  },
  {
    value: 4,
    name: '旧闻重复'
  },
  {
    value: 6,
    name: '内容不实'
  },
  {
    value: 8,
    name: '侵权'
  },
  {
    value: 5,
    name: '广告软文'
  },
  {
    value: 7,
    name: '涉嫌违法犯罪'
  }
]
export default reports
