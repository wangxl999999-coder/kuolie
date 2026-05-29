const app = getApp()
const pointsUtil = require('../../utils/points')

Page({
  data: {
    userInfo: {},
    userId: '',
    points: 0,
    postCount: 0,
    historyCount: 0
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.initData()
  },

  initData() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    const myPosts = wx.getStorageSync('myPosts') || []
    const pointsHistory = wx.getStorageSync('pointsHistory') || []
    this.setData({
      userInfo,
      userId: wx.getStorageSync('userId') || 'KL' + Math.floor(Math.random() * 100000),
      points: pointsUtil.getPoints(),
      postCount: myPosts.length,
      historyCount: pointsHistory.length
    })
  },

  onEditProfile() {
    wx.showActionSheet({
      itemList: ['修改昵称', '修改城市'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '修改昵称',
            editable: true,
            placeholderText: '请输入昵称',
            success(modalRes) {
              if (modalRes.confirm && modalRes.content) {
                const userInfo = app.globalData.userInfo
                userInfo.nickName = modalRes.content
                app.globalData.userInfo = userInfo
                wx.setStorageSync('userInfo', userInfo)
                wx.showToast({ title: '修改成功', icon: 'success' })
              }
            }
          })
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '修改城市',
            editable: true,
            placeholderText: '请输入城市',
            success(modalRes) {
              if (modalRes.confirm && modalRes.content) {
                const userInfo = app.globalData.userInfo
                userInfo.city = modalRes.content
                app.globalData.userInfo = userInfo
                wx.setStorageSync('userInfo', userInfo)
                wx.showToast({ title: '修改成功', icon: 'success' })
              }
            }
          })
        }
      }
    })
  },

  onMyPosts() {
    wx.navigateTo({ url: '/pages/myposts/myposts' })
  },

  onFeedback() {
    wx.navigateTo({ url: '/pages/feedback/feedback' })
  },

  onAbout() {
    wx.showModal({
      title: '关于扩列',
      content: '扩列 - 一个社交小程序\n交友、扩列、游戏组队、树洞倾诉\n版本：1.0.0',
      showCancel: false
    })
  },

  onViewHistory() {
    const history = wx.getStorageSync('pointsHistory') || []
    if (history.length === 0) {
      wx.showToast({ title: '暂无积分记录', icon: 'none' })
      return
    }
    const list = history.slice(0, 20).map(h =>
      h.reason + '  ' + (h.amount > 0 ? '+' : '') + h.amount + '  余额:' + h.balance
    ).join('\n')
    wx.showModal({
      title: '积分记录',
      content: list,
      showCancel: false
    })
  },

  onClearCache() {
    wx.showModal({
      title: '确认清除',
      content: '清除缓存后将重置本地数据，确认清除？',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync()
          app.initUser()
          wx.showToast({ title: '缓存已清除', icon: 'success' })
        }
      }
    })
  }
})
