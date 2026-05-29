const app = getApp()
const pointsUtil = require('../../utils/points')
const { mockPosts } = require('../../utils/mock')

Page({
  data: {
    categories: [],
    selectedCategory: 0,
    content: '',
    images: [],
    isTop: false,
    points: 0,
    canPublish: false
  },

  onLoad() {
    this.setData({
      categories: app.globalData.categories,
      points: pointsUtil.getPoints()
    })
  },

  onShow() {
    this.setData({ points: pointsUtil.getPoints() })
  },

  onCategorySelect(e) {
    const id = Number(e.currentTarget.dataset.id)
    this.setData({ selectedCategory: id })
    this.checkCanPublish()
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
    this.checkCanPublish()
  },

  onImageAdd() {
    const count = 9 - this.data.images.length
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      }
    })
  },

  onImageDelete(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images })
  },

  onImagePreview(e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    })
  },

  onTopToggle() {
    const newTop = !this.data.isTop
    if (newTop && this.data.points < 200) {
      wx.showToast({ title: '积分不足200，无法置顶', icon: 'none' })
      return
    }
    this.setData({ isTop: newTop })
  },

  checkCanPublish() {
    const { selectedCategory, content } = this.data
    this.setData({
      canPublish: selectedCategory > 0 && content.trim().length > 0
    })
  },

  onPublish() {
    if (!this.data.canPublish) return

    if (this.data.isTop && this.data.points < 200) {
      wx.showToast({ title: '积分不足，无法置顶', icon: 'none' })
      return
    }

    wx.showLoading({ title: '发布中...' })

    if (this.data.isTop) {
      const result = pointsUtil.deductPoints(200, '帖子置顶')
      if (result === false) {
        wx.hideLoading()
        return
      }
    }

    const category = this.data.categories.find(c => c.id === this.data.selectedCategory)
    const newPost = {
      id: Date.now(),
      category: this.data.selectedCategory,
      categoryName: category ? category.name : '',
      content: this.data.content,
      images: this.data.images,
      hasQrCode: this.data.images.length > 0,
      isTop: this.data.isTop,
      author: {
        nickName: app.globalData.userInfo.nickName || '我',
        avatarUrl: app.globalData.userInfo.avatarUrl || '',
        city: app.globalData.userInfo.city || ''
      },
      commentCount: 0,
      likeCount: 0,
      createTime: Date.now()
    }

    const myPosts = wx.getStorageSync('myPosts') || []
    myPosts.unshift(newPost)
    wx.setStorageSync('myPosts', myPosts)

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 1500
      })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }, 800)
  }
})
