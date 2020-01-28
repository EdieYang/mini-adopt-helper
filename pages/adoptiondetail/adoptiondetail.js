const app = getApp()
const photoPrefix = app.globalData.photoPrefix;

var userId
var petId


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    index: 0,
    showFilter: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    petId = options.petId
    userId = app.globalData.userId
  },

  getAdoptionDetail: function() {
    var that = this
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/pets/' + petId,
      data: {
        userId: userId
      },
      method: "GET",
      success: function(res) {
        var petInfo = res.data.data.petInfo
        var userInfo = res.data.data.userInfo
        var mediaList = petInfo.mediaList
        var petCharacteristic = petInfo.petCharacteristic
        petInfo.petCharacteristic = JSON.parse(petCharacteristic)
        petInfo.adoptRequirements = JSON.parse(petInfo.adoptRequirements)
        var images = []
        for (var i = 0; i < mediaList.length; i++) {
          images.push(photoPrefix + mediaList[i].mediaPath)
        }
        that.setData({
          petInfo: petInfo,
          imgUrls: images,
          adoptUserInfo: userInfo
        })
      }
    })
  },

  getUserInfo: function() {
    var that = this
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/users/adoptUser',
      data: {
        userId: userId
      },
      method: "GET",
      success: function(res) {
        var adoptUserInfo = res.data.data
        that.setData({
          adoptUserInfo: adoptUserInfo
        })
      }
    })
  },

  swiper: function(e) {
    var index = e.detail.current
    this.setData({
      index: index
    })
  },
  copyWx: function(e) {
    var wxId = e.currentTarget.dataset.wx
    if (wxId == '') {
      return
    }


    wx.setClipboardData({
      data: wxId,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  call: function(e) {
    var phone = e.currentTarget.dataset.phone
    if (phone == '') {
      return
    }

    wx.makePhoneCall({
      phoneNumber: phone // 仅为示例，并非真实的电话号码
    })
  },
  home: function() {
    wx.navigateTo({
      url: '../../mine/home/home',
    })
  },
  report: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['广告信息', '诈骗信息', '虚假信息'],
      success(res) {
        console.log(res.tapIndex)
        wx.request({
          url: app.globalData.requestUrlCms + '/adopt/reports', // 仅为示例，并非真实的接口地址
          data: {
            petId: that.data.petInfo.petId,
            reportType: res.tapIndex,
            userId: userId
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(res) {
            console.log(res.data)
            if (res.data.success) {
              wx.showToast({
                title: '举报成功，平台将会对此信息进行审核。',
                icon: 'none',
                duration: 4000
              })
            }
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  modify: function() {
    wx.navigateTo({
      url: '../../post/adopt/adopt?loadState=1&petId=' + this.data.petInfo.petId,
    })
  },
  apply: function() {
    wx.navigateTo({
      url: '../../post/apply/apply?petId=' + this.data.petInfo.petId,
    })
  },
  collect: function(e) {
    var that = this
    var id = e.currentTarget.dataset.collect
    if (id == 1) {
      wx.request({
        url: app.globalData.requestUrlCms + '/adopt/pets/collect', // 仅为示例，并非真实的接口地址
        data: {
          petId: that.data.petInfo.petId,
          userId: userId
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          if (res.data.success) {
            that.data.petInfo.collected = true
            that.setData({
              petInfo: that.data.petInfo
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.requestUrlCms + '/adopt/pets/collect', // 仅为示例，并非真实的接口地址
        data: {
          petId: that.data.petInfo.petId,
          userId: userId
        },
        method: 'DELETE',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log(res.data)
          if (res.data.success) {
            that.data.petInfo.collected = false
            that.setData({
              petInfo: that.data.petInfo
            })
          }
        }
      })
    }

  },
  previewImg: function(e) {
    var imgurls = this.data.imgUrls

    var imgindex = e.currentTarget.dataset.imgindex;

    wx.previewImage({
      urls: imgurls,
      current: imgurls[imgindex],
      success: function() {

      },
      fail: function(e) {
        console.log(e)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    this.getAdoptionDetail()
  },
  online: function(e) {
    var that = this
    var petId = e.currentTarget.dataset.petid
    var dataReq = {
      petId: petId,
      adoptStatus: '3',
      mediaList: []
    }
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/pets/info',
      data: dataReq,
      method: "PUT",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.getAdoptionDetail()
      }
    })
  },
  offline: function(e) {
    var that = this
    var petId = e.currentTarget.dataset.petid
    var dataReq = {
      petId: petId,
      adoptStatus: '2',
      mediaList: []
    }
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/pets/info',
      data: dataReq,
      method: "PUT",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.getAdoptionDetail()
      }
    })
  },

  submitPass: function() {
    wx.showLoading({
      title: '操作中',
    })
    petId = this.data.petInfo.petId
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/pets/info',
      data: {
        petId: petId,
        adoptStatus: 3
      },
      method: "PUT",
      success: function(res) {
        wx.hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: '审核成功',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      }
    })

  },
  submitRefuse: function() {
    this.setData({
      showFilter: true
    })
    petId = this.data.petInfo.petId
  },
  refuse: function(e) {
    wx.showLoading({
      title: '操作中',
    })
    var memo = e.detail.value.memo
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/pets/info',
      data: {
        petId: petId,
        adoptStatus: 1,
        memo: memo
      },
      method: "PUT",
      success: function(res) {
        wx.hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: '审核成功',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      }
    })
  },
  cancel: function() {
    this.setData({
      showFilter: false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})