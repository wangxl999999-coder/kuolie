const app = getApp()
const { timeAgo } = require('../../utils/util')
const { mockPosts } = require('../../utils/mock')

Page({
  data: {
    postId: 0,
    post: {},
    comments: [],
    commentText: '',
    qrUnlocked: false,
    focus: false
  },

  onLoad(options) {
    const id = Number(options.id) || 1
    const focus = options.focus === 'true'
    this.setData({ postId: id, focus })
    this.loadPost(id)
    this.loadComments(id)
  },

  loadPost(id) {
    const myPosts = wx.getStorageSync('myPosts') || []
    const allPosts = [...myPosts, ...mockPosts]
    const post = allPosts.find(p => p.id === id)
    if (post) {
      this.setData({
        post: { ...post, timeAgo: timeAgo(post.createTime) }
      })
    }
  },

  loadComments(id) {
    const comments = wx.getStorageSync('comments_' + id) || []
    this.setData({
      comments: comments.map(c => ({ ...c, timeAgo: timeAgo(c.createTime) }))
    })
  },

  onImagePreview(e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: this.data.post.images
    })
  },

  onUnlockQrCode() {
    if (this.data.qrUnlocked) return
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
          that.setData({ qrUnlocked: true })
          wx.showToast({ title: '二维码已解锁', icon: 'success' })
        } else {
          wx.showToast({ title: '需观看完整视频', icon: 'none' })
        }
      })
      rewardedVideoAd.onError(() => {
        that.setData({ qrUnlocked: true })
        wx.showToast({ title: '二维码已解锁', icon: 'success' })
      })
      rewardedVideoAd.show().catch(() => {
        that.setData({ qrUnlocked: true })
        wx.showToast({ title: '二维码已解锁', icon: 'success' })
      })
    } else {
      that.setData({ qrUnlocked: true })
      wx.showToast({ title: '二维码已解锁', icon: 'success' })
    }
  },

  onCommentInput(e) {
    this.setData({ commentText: e.detail.value })
  },

  onCommentSubmit() {
    const text = this.data.commentText.trim()
    if (!text) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' })
      return
    }

    const newComment = {
      id: Date.now(),
      nickName: app.globalData.userInfo.nickName || '我',
      content: text,
      createTime: Date.now(),
      timeAgo: '刚刚'
    }

    const comments = [newComment, ...this.data.comments]
    wx.setStorageSync('comments_' + this.data.postId, comments)

    this.setData({
      comments,
      commentText: '',
      'post.commentCount': comments.length
    })
    wx.showToast({ title: '评论成功', icon: 'success' })
  },

  onLike() {
    const post = this.data.post
    const isLiked = !post.isLiked
    this.setData({
      'post.isLiked': isLiked,
      'post.likeCount': isLiked ? post.likeCount + 1 : post.likeCount - 1
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.post.content.substring(0, 20) + '...',
      path: '/pages/postdetail/postdetail?id=' + this.data.postId
    }
  }
})
