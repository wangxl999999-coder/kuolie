const app = getApp()

function getPoints() {
  return wx.getStorageSync('points') || 0
}

function setPoints(val) {
  wx.setStorageSync('points', val)
  app.globalData.points = val
}

function addPoints(amount, reason) {
  const current = getPoints()
  const newVal = current + amount
  setPoints(newVal)
  const history = wx.getStorageSync('pointsHistory') || []
  history.unshift({
    amount,
    reason,
    balance: newVal,
    time: Date.now()
  })
  wx.setStorageSync('pointsHistory', history)
  wx.showToast({
    title: '+' + amount + '积分',
    icon: 'none'
  })
  return newVal
}

function deductPoints(amount, reason) {
  const current = getPoints()
  if (current < amount) {
    wx.showToast({
      title: '积分不足',
      icon: 'none'
    })
    return false
  }
  const newVal = current - amount
  setPoints(newVal)
  const history = wx.getStorageSync('pointsHistory') || []
  history.unshift({
    amount: -amount,
    reason,
    balance: newVal,
    time: Date.now()
  })
  wx.setStorageSync('pointsHistory', history)
  return newVal
}

function checkIn() {
  const lastCheckIn = wx.getStorageSync('lastCheckIn')
  const today = new Date().toDateString()
  if (lastCheckIn === today) {
    wx.showToast({
      title: '今日已签到',
      icon: 'none'
    })
    return false
  }
  wx.setStorageSync('lastCheckIn', today)
  const count = (wx.getStorageSync('checkInCount') || 0) + 1
  wx.setStorageSync('checkInCount', count)
  addPoints(10, '每日签到')
  return true
}

function isCheckedInToday() {
  const lastCheckIn = wx.getStorageSync('lastCheckIn')
  const today = new Date().toDateString()
  return lastCheckIn === today
}

module.exports = {
  getPoints,
  setPoints,
  addPoints,
  deductPoints,
  checkIn,
  isCheckedInToday
}
