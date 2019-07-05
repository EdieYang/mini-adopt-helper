const photoPrefix = 'https://melody.memorychilli.com/';

const app = getApp()
var pageNum = 1
var pageSize = 10
var certificationListArr = []
var status = 0


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    chosenId: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  chooseTab: function (e) {
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

  getCertificationList: function () {
    var that = this
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/certification/list',
      data: {
        status: status,
        pageNum: pageNum,
        pageSize: pageSize
      },
      method: "GET",
      success: function (res) {
        var certificationList = res.data.data.list
        var bottomLast = false
        if (res.data.data.total < pageSize) {
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
  detail: function (e) {
    var petId = e.currentTarget.dataset.petid
    wx.navigateTo({
      url: '../adoptiondetail/adoptiondetail?petId=' + petId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    certificationListArr = []
    this.getCertificationList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})