const mockPosts = [
  {
    id: 1,
    category: 1,
    categoryName: '交友',
    content: '97年女生，坐标广州，喜欢旅行和美食，想认识志同道合的小伙伴～',
    images: [],
    hasQrCode: true,
    isTop: true,
    author: {
      nickName: '小鱼儿',
      avatarUrl: '',
      city: '广州'
    },
    commentCount: 12,
    likeCount: 28,
    createTime: Date.now() - 3600000
  },
  {
    id: 2,
    category: 2,
    categoryName: '扩列',
    content: '00后大学生，扩列啦！喜欢追剧、听歌，来加我聊聊天呀～vx在二维码里',
    images: [],
    hasQrCode: true,
    isTop: false,
    author: {
      nickName: '星星',
      avatarUrl: '',
      city: '深圳'
    },
    commentCount: 8,
    likeCount: 15,
    createTime: Date.now() - 7200000
  },
  {
    id: 3,
    category: 3,
    categoryName: '游戏组队',
    content: '王者荣耀五排缺1！钻石段位，有语音，不喷人，来个辅助！今晚8点开黑',
    images: [],
    hasQrCode: true,
    isTop: false,
    author: {
      nickName: '大魔王',
      avatarUrl: '',
      city: '北京'
    },
    commentCount: 23,
    likeCount: 45,
    createTime: Date.now() - 10800000
  },
  {
    id: 4,
    category: 4,
    categoryName: '树洞倾诉',
    content: '最近工作压力好大，每天加班到很晚，感觉生活失去了方向...有没有人能聊聊',
    images: [],
    hasQrCode: false,
    isTop: false,
    author: {
      nickName: '匿名',
      avatarUrl: '',
      city: '上海'
    },
    commentCount: 31,
    likeCount: 56,
    createTime: Date.now() - 14400000
  },
  {
    id: 5,
    category: 1,
    categoryName: '交友',
    content: '95年男生，坐标成都，摄影爱好者，想认识喜欢拍照的朋友，周末一起出去拍照呀',
    images: [],
    hasQrCode: true,
    isTop: false,
    author: {
      nickName: '光影猎人',
      avatarUrl: '',
      city: '成都'
    },
    commentCount: 5,
    likeCount: 19,
    createTime: Date.now() - 18000000
  },
  {
    id: 6,
    category: 3,
    categoryName: '游戏组队',
    content: '原神萌新求带！刚入坑不久，想找大佬一起探索提瓦特大陆～',
    images: [],
    hasQrCode: true,
    isTop: false,
    author: {
      nickName: '旅行者',
      avatarUrl: '',
      city: '杭州'
    },
    commentCount: 16,
    likeCount: 22,
    createTime: Date.now() - 21600000
  }
]

const mockCityGroups = [
  {
    id: 1,
    name: '广州交友群',
    city: '广州',
    memberCount: 328,
    description: '广州本地交友群，分享生活，结交好友',
    qrCodeUrl: '',
    tags: ['交友', '线下活动']
  },
  {
    id: 2,
    name: '深圳扩列群',
    city: '深圳',
    memberCount: 256,
    description: '深圳年轻人扩列交流群',
    qrCodeUrl: '',
    tags: ['扩列', '聊天']
  },
  {
    id: 3,
    name: '北京游戏开黑群',
    city: '北京',
    memberCount: 412,
    description: '北京游戏玩家组队开黑，王者荣耀/LOL/原神',
    qrCodeUrl: '',
    tags: ['游戏', '开黑']
  },
  {
    id: 4,
    name: '上海树洞群',
    city: '上海',
    memberCount: 189,
    description: '倾诉心事，互相温暖',
    qrCodeUrl: '',
    tags: ['倾诉', '互助']
  },
  {
    id: 5,
    name: '成都吃喝玩乐群',
    city: '成都',
    memberCount: 375,
    description: '成都本地吃喝玩乐，周末约起',
    qrCodeUrl: '',
    tags: ['交友', '美食']
  },
  {
    id: 6,
    name: '杭州文艺青年群',
    city: '杭州',
    memberCount: 143,
    description: '摄影、读书、咖啡，杭州文艺青年的聚集地',
    qrCodeUrl: '',
    tags: ['文艺', '摄影']
  }
]

const mockBanners = [
  { id: 1, image: '', title: '交友扩列，从这里开始', link: '' },
  { id: 2, image: '', title: '游戏组队，上分不愁', link: '' },
  { id: 3, image: '', title: '签到赚积分，解锁更多功能', link: '' }
]

module.exports = {
  mockPosts,
  mockCityGroups,
  mockBanners
}
