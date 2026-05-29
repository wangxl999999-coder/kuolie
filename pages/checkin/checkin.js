const pointsUtil = require('../../utils/points')

Page({
  data: {
    isCheckedIn: false,
    checkInCount: 0,
    points: 0,
    videoWatched: false,
    calendarDays: []
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.initData()
  },

  initData() {
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const today = now.getDate()
    const checkedDays = wx.getStorageSync('checkedDays') || {}
    const monthKey = now.getFullYear() + '-' + (now.getMonth() + 1)
    const monthChecked = checkedDays[monthKey] || []

    const calendarDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        checked: monthChecked.indexOf(i) !== -1
      })
    }

    const videoWatchedToday = wx.getStorageSync('videoWatched_' + now.toDateString()) || false

    this.setData({
      isCheckedIn: pointsUtil.isCheckedInToday(),
      checkInCount: wx.getStorageSync('checkInCount') || 0,
      points: pointsUtil.getPoints(),
      videoWatched: videoWatchedToday,
      calendarDays
    })
  },

  onCheckIn() {
    if (this.data.isCheckedIn) return
    const success = pointsUtil.checkIn()
    if (success) {
      const now = new Date()
      const checkedDays = wx.getStorageSync('checkedDays') || {}
      const monthKey = now.getFullYear() + '-' + (now.getMonth() + 1)
      if (!checkedDays[monthKey]) checkedDays[monthKey] = []
      checkedDays[monthKey].push(now.getDate())
      wx.setStorageSync('checkedDays', checkedDays)

      this.setData({
        isCheckedIn: true,
        checkInCount: this.data.checkInCount + 1,
        points: pointsUtil.getPoints()
      })
      this.initData()
    }
  },

  onWatchVideo() {
    if (this.data.videoWatched) return
    const that = this
    const rewardedVideoAd = wx.createRewardedVideoAd && wx.createRewardedVideoAd({ adUnitId: 'test' })
    if (rewardedVideoAd) {
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          that.completeVideoTask()
        } else {
          wx.showToast({ title: '需观看完整视频', icon: 'none' })
        }
      })
      rewardedVideoAd.onError(() => {
        that.completeVideoTask()
      })
      rewardedVideoAd.show().catch(() => {
        that.completeVideoTask()
      })
    } else {
      that.completeVideoTask()
    }
  },

  completeVideoTask() {
    const today = new Date().toDateString()
    wx.setStorageSync('videoWatched_' + today, true)
    pointsUtil.addPoints(10, '观看视频')
    this.setData({
      videoWatched: true,
      points: pointsUtil.getPoints()
    })
  },

  onInviteFriend() {
    wx.showModal({
      title: '邀请好友',
      content: '分享小程序给好友，好友首次打开后你将获得50积分奖励',
      confirmText: '去分享',
      success(res) {
        if (res.confirm) {
          wx.shareAppMessage && wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
          })
        }
      }
    })
  },

  onViewHistory() {
    const history = wx.getStorageSync('pointsHistory') || []
    if (history.length === 0) {
      wx.showToast({ title: '暂无积分记录', icon: 'none' })
      return
    }
    const list = history.slice(0, 20).map(h => h.reason + '  ' + (h.amount > 0 ? '+' : '') + h.amount + '  余额:' + h.balance).join('\n')
    wx.showModal({
      title: '积分记录',
      content: list,
      showCancel: false
    })
  },

  onShareAppMessage() {
    return {
      title: '来扩列，认识新朋友！',
      path: '/pages/index/index'
    }
  }
})
