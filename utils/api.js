const app = getApp()

const BASE_URL = app.globalData.baseUrl

function request(url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: method || 'GET',
      data: data || {},
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token') || ''
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function getPosts(params) {
  return request('/posts', 'GET', params)
}

function getPostDetail(id) {
  return request('/posts/' + id, 'GET')
}

function publishPost(data) {
  return request('/posts', 'POST', data)
}

function getComments(postId) {
  return request('/posts/' + postId + '/comments', 'GET')
}

function addComment(postId, data) {
  return request('/posts/' + postId + '/comments', 'POST', data)
}

function getCityGroups(params) {
  return request('/citygroups', 'GET', params)
}

function searchPosts(keyword) {
  return request('/posts/search', 'GET', { keyword })
}

function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: BASE_URL + '/upload',
      filePath,
      name: 'file',
      header: {
        'token': wx.getStorageSync('token') || ''
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data))
        } else {
          reject(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  request,
  getPosts,
  getPostDetail,
  publishPost,
  getComments,
  addComment,
  getCityGroups,
  searchPosts,
  uploadFile
}
