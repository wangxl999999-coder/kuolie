const { timeAgo } = require('../../utils/util')

Page({
  data: {
    posts: []
  },

  onLoad() {
    this.loadPosts()
  },

  onShow() {
    this.loadPosts()
  },

  loadPosts() {
    const myPosts = wx.getStorageSync('myPosts') || []
    this.setData({
      posts: myPosts.map(p => ({ ...p, timeAgo: timeAgo(p.createTime) }))
    })
  },

  onPostTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/postdetail/postdetail?id=' + id })
  },

  onDeletePost(e) {
    const id = e.currentTarget.dataset.id
    const that = this
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确认删除？',
      success(res) {
        if (res.confirm) {
          let myPosts = wx.getStorageSync('myPosts') || []
          myPosts = myPosts.filter(p => p.id !== id)
          wx.setStorageSync('myPosts', myPosts)
          that.loadPosts()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  }
})
