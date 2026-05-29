const { timeAgo } = require('../../utils/util')

Page({
  data: {
    feedbackTypes: [
      { value: 'complaint', label: '投诉' },
      { value: 'suggestion', label: '建议' },
      { value: 'bug', label: '故障反馈' },
      { value: 'other', label: '其他' }
    ],
    selectedType: '',
    content: '',
    contact: '',
    images: [],
    canSubmit: false,
    feedbackList: []
  },

  onLoad() {
    this.loadFeedbackList()
  },

  onTypeSelect(e) {
    this.setData({ selectedType: e.currentTarget.dataset.value })
    this.checkCanSubmit()
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
    this.checkCanSubmit()
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value })
  },

  onImageAdd() {
    const count = 4 - this.data.images.length
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

  checkCanSubmit() {
    const { selectedType, content } = this.data
    this.setData({
      canSubmit: selectedType !== '' && content.trim().length > 0
    })
  },

  onSubmit() {
    if (!this.data.canSubmit) return

    wx.showLoading({ title: '提交中...' })

    const typeMap = {
      complaint: '投诉',
      suggestion: '建议',
      bug: '故障反馈',
      other: '其他'
    }

    const feedback = {
      id: Date.now(),
      type: this.data.selectedType,
      typeLabel: typeMap[this.data.selectedType],
      content: this.data.content,
      contact: this.data.contact,
      images: this.data.images,
      status: 0,
      statusLabel: '处理中',
      createTime: Date.now(),
      timeAgo: '刚刚'
    }

    const list = wx.getStorageSync('feedbackList') || []
    list.unshift(feedback)
    wx.setStorageSync('feedbackList', list)

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
      })
      this.setData({
        selectedType: '',
        content: '',
        contact: '',
        images: [],
        canSubmit: false
      })
      this.loadFeedbackList()
    }, 800)
  },

  loadFeedbackList() {
    const list = wx.getStorageSync('feedbackList') || []
    this.setData({
      feedbackList: list.map(f => ({ ...f, timeAgo: timeAgo(f.createTime) }))
    })
  }
})
