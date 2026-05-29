App({
  onLaunch() {
    this.checkLogin()
  },

  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      this.initUser()
    } else {
      this.globalData.userInfo = userInfo
      this.globalData.points = wx.getStorageSync('points') || 0
    }
  },

  initUser() {
    const defaultUser = {
      nickName: '新用户',
      avatarUrl: '',
      gender: 0,
      city: '',
      createTime: Date.now()
    }
    wx.setStorageSync('userInfo', defaultUser)
    wx.setStorageSync('points', 100)
    const pointsHistory = [
      {
        amount: 100,
        reason: '新用户注册奖励',
        balance: 100,
        time: Date.now()
      }
    ]
    wx.setStorageSync('pointsHistory', pointsHistory)
    this.globalData.userInfo = defaultUser
    this.globalData.points = 100
  },

  globalData: {
    userInfo: null,
    points: 0,
    baseUrl: 'https://your-api-domain.com/api',
    categories: [
      { id: 1, name: '交友', icon: '💕' },
      { id: 2, name: '扩列', icon: '📱' },
      { id: 3, name: '游戏组队', icon: '🎮' },
      { id: 4, name: '树洞倾诉', icon: '🌙' }
    ]
  }
})
