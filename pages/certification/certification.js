const photoPrefix = 'https://melody.memorychilli.com/';

const app = getApp()
var pageNum = 1
var pageSize = 10
var certificationListArr = []
var status = 0
var formId
var id
var userId
var bottomLast = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    chosenId: 1,
    showFilter: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  chooseTab: function(e) {
    var that = this
    var chosenId = e.currentTarget.dataset.id;
    if (chosenId == 1) {
      status = '0'
    } else if (chosenId == 2) {
      status = '2'
    } else if (chosenId == 3) {
      status = '1'
    }
    this.setData({
      showLoading: true,
      chosenId: chosenId,
    })
    certificationListArr = []
    this.getCertificationList()
  },

  getCertificationList: function() {
    var that = this
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/certification/list',
      data: {
        status: status,
        pageNum: pageNum,
        pageSize: pageSize
      },
      method: "GET",
      success: function(res) {
        var certificationList = res.data.data.list
        bottomLast = false
        if (certificationList.length < pageSize) {
          bottomLast = true
        }

        certificationListArr = certificationListArr.concat(certificationList)
        that.setData({
          certificationList: certificationListArr,
          showLoading: false,
          bottomLast: bottomLast
        })
      }
    })
  },
  detail: function(e) {
    var petId = e.currentTarget.dataset.petid
    wx.navigateTo({
      url: '../adoptiondetail/adoptiondetail?petId=' + petId,
    })
  },
  pass: function(e) {
    var that = this
    var id = e.detail.value.id
    var formId = e.detail.formId
    var userId = e.detail.value.userId
    wx.showLoading({
      title: '操作中',
    })
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/certification',
      data: {
        status: 1,
        id: id,
        formId: formId,
        userId: userId
      },
      method: "PUT",
      success: function(res) {
        if (res.data.success) {
          wx.hideLoading()
          wx.showToast({
            title: '审核成功',
            icon: 'none',
          })
          certificationListArr = []
          that.getCertificationList()
        }
      }
    })
  },
  refuse: function(e) {
    var that = this
    var memo = e.detail.value.memo
    wx.showLoading({
      title: '操作中',
    })
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/certification',
      data: {
        status: 2,
        id: id,
        formId: formId,
        userId: userId,
        memo: memo
      },
      method: "PUT",
      success: function(res) {
        if (res.data.success) {
          that.setData({
            showFilter: false
          })
          wx.hideLoading()
          wx.showToast({
            title: '操作成功',
            icon: 'none',
          })
          certificationListArr = []
          that.getCertificationList()
        }
      }
    })
  },
  refusePop: function(e) {
    this.setData({
      showFilter: true
    })
    formId = e.detail.formId
    id = e.detail.value.id
    userId = e.detail.value.userId
  },
  cancel: function() {
    this.setData({
      showFilter: false
    })
  },
  previewImg:function(e){
    var imgSrc=e.currentTarget.dataset.img
    wx.previewImage({
      current: imgSrc, // 当前显示图片的http链接
      urls: [imgSrc] // 需要预览的图片http链接列表
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
    certificationListArr = []
    this.getCertificationList()
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
    if (!bottomLast) {
      pageNum++
      this.getCertificationList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})