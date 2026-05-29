const app = getApp()
const { timeAgo } = require('../../utils/util')
const pointsUtil = require('../../utils/points')
const { mockPosts, mockBanners } = require('../../utils/mock')

Page({
  data: {
    points: 0,
    banners: [],
    categories: [],
    currentCategory: 0,
    posts: [],
    page: 1,
    loading: false,
    noMore: false,
    showSearch: false,
    searchKeyword: '',
    searchResults: [],
    hotKeywords: ['交友', '扩列', '王者荣耀', '原神', '树洞', '同城']
  },

  onLoad() {
    this.setData({
      categories: app.globalData.categories,
      banners: mockBanners.map((b, i) => ({
        ...b,
        color1: ['#FF6B6B', '#4ECDC4', '#45B7D1'][i] || '#FF6B6B',
        color2: ['#FF8E8E', '#6EE7DE', '#65C9E1'][i] || '#FF8E8E'
      }))
    })
    this.loadPosts()
  },

  onShow() {
    this.setData({ points: pointsUtil.getPoints() })
    this.loadPosts()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, noMore: false, posts: [] })
    this.loadPosts()
    setTimeout(() => { wx.stopPullDownRefresh() }, 800)
  },

  onReachBottom() {
    if (!this.data.noMore && !this.data.loading) {
      this.loadPosts()
    }
  },

  loadPosts() {
    this.setData({ loading: true })
    const myPosts = wx.getStorageSync('myPosts') || []
    const allPosts = [...myPosts, ...mockPosts].map(p => ({
      ...p,
      timeAgo: timeAgo(p.createTime)
    }))
    let filtered = allPosts
    if (this.data.currentCategory !== 0) {
      filtered = allPosts.filter(p => p.category === this.data.currentCategory)
    }
    const topPosts = filtered.filter(p => p.isTop)
    const normalPosts = filtered.filter(p => !p.isTop)
    const sorted = [...topPosts, ...normalPosts]
    this.setData({
      posts: sorted,
      loading: false,
      noMore: true
    })
  },

  onCategoryTap(e) {
    const id = Number(e.currentTarget.dataset.id)
    this.setData({ currentCategory: id, page: 1, noMore: false })
    this.loadPosts()
  },

  onPostTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/postdetail/postdetail?id=' + id })
  },

  onSearchTap() {
    this.setData({ showSearch: true })
  },

  onSearchCancel() {
    this.setData({ showSearch: false, searchKeyword: '', searchResults: [] })
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    if (e.detail.value) {
      this.doSearch(e.detail.value)
    } else {
      this.setData({ searchResults: [] })
    }
  },

  onSearchConfirm() {
    if (this.data.searchKeyword) {
      this.doSearch(this.data.searchKeyword)
    }
  },

  onHotKeywordTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ searchKeyword: keyword })
    this.doSearch(keyword)
  },

  doSearch(keyword) {
    const myPosts = wx.getStorageSync('myPosts') || []
    const allPosts = [...myPosts, ...mockPosts]
    const results = allPosts.filter(p =>
      p.content.indexOf(keyword) !== -1 ||
      p.categoryName.indexOf(keyword) !== -1
    ).map(p => ({ ...p, timeAgo: timeAgo(p.createTime) }))
    this.setData({ searchResults: results })
  }
})
