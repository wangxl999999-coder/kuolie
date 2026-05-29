const app = getApp()

Component({
  properties: {
    post: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      const id = this.data.post.id
      wx.navigateTo({ url: '/pages/postdetail/postdetail?id=' + id })
    },

    onImagePreview(e) {
      const src = e.currentTarget.dataset.src
      const images = this.data.post.images
      wx.previewImage({ current: src, urls: images })
    },

    onQrCodeTap() {
      if (this.data.post.qrUnlocked) return
      const that = this
      wx.showModal({
        title: '解锁二维码',
        content: '观看视频广告后可查看完整二维码内容',
        confirmText: '观看视频',
        cancelText: '取消',
        success(res) {
          if (res.confirm) {
            that.watchAdUnlock()
          }
        }
      })
    },

    watchAdUnlock() {
      const that = this
      const rewardedVideoAd = wx.createRewardedVideoAd && wx.createRewardedVideoAd({ adUnitId: 'test' })
      if (rewardedVideoAd) {
        rewardedVideoAd.onClose((res) => {
          if (res && res.isEnded) {
            that.setData({ 'post.qrUnlocked': true })
            wx.showToast({ title: '二维码已解锁', icon: 'success' })
          } else {
            wx.showToast({ title: '需观看完整视频', icon: 'none' })
          }
        })
        rewardedVideoAd.onError(() => {
          that.setData({ 'post.qrUnlocked': true })
          wx.showToast({ title: '二维码已解锁', icon: 'success' })
        })
        rewardedVideoAd.show().catch(() => {
          that.setData({ 'post.qrUnlocked': true })
          wx.showToast({ title: '二维码已解锁', icon: 'success' })
        })
      } else {
        that.setData({ 'post.qrUnlocked': true })
        wx.showToast({ title: '二维码已解锁', icon: 'success' })
      }
    },

    onCommentTap() {
      const id = this.data.post.id
      wx.navigateTo({ url: '/pages/postdetail/postdetail?id=' + id + '&focus=true' })
    },

    onLikeTap() {
      const post = this.data.post
      const isLiked = !post.isLiked
      const likeCount = isLiked ? post.likeCount + 1 : post.likeCount - 1
      this.setData({
        'post.isLiked': isLiked,
        'post.likeCount': likeCount
      })
    },

    onShareTap() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  }
})
