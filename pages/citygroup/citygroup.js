const pointsUtil = require('../../utils/points')
const { mockCityGroups } = require('../../utils/mock')

Page({
  data: {
    keyword: '',
    groups: [],
    filteredGroups: [],
    points: 0
  },

  onLoad() {
    this.setData({
      groups: mockCityGroups.map(g => ({ ...g, qrUnlocked: false })),
      filteredGroups: mockCityGroups.map(g => ({ ...g, qrUnlocked: false })),
      points: pointsUtil.getPoints()
    })
  },

  onShow() {
    this.setData({ points: pointsUtil.getPoints() })
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
    this.filterGroups()
  },

  onSearch() {
    this.filterGroups()
  },

  filterGroups() {
    const keyword = this.data.keyword.trim()
    if (!keyword) {
      this.setData({ filteredGroups: this.data.groups })
      return
    }
    const filtered = this.data.groups.filter(g =>
      g.name.indexOf(keyword) !== -1 ||
      g.city.indexOf(keyword) !== -1 ||
      g.description.indexOf(keyword) !== -1
    )
    this.setData({ filteredGroups: filtered })
  },

  onViewQrCode(e) {
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    const group = this.data.groups.find(g => g.id === id)

    if (group.qrUnlocked) return

    if (this.data.points < 100) {
      wx.showModal({
        title: '积分不足',
        content: '查看群二维码需要100积分，当前积分' + this.data.points + '，去赚取积分？',
        confirmText: '去签到',
        cancelText: '取消',
        success(res) {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/checkin/checkin' })
          }
        }
      })
      return
    }

    const that = this
    wx.showModal({
      title: '确认查看',
      content: '查看「' + name + '」二维码将消耗100积分，确认查看？',
      success(res) {
        if (res.confirm) {
          const result = pointsUtil.deductPoints(100, '查看同城群二维码')
          if (result !== false) {
            const groups = that.data.groups.map(g => {
              if (g.id === id) g.qrUnlocked = true
              return g
            })
            that.setData({
              groups,
              filteredGroups: that.data.filteredGroups.map(g => {
                if (g.id === id) g.qrUnlocked = true
                return g
              }),
              points: pointsUtil.getPoints()
            })
            wx.showToast({ title: '二维码已解锁', icon: 'success' })
          }
        }
      }
    })
  }
})
