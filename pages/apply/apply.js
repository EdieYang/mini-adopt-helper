var pageNum = 1
var pageSize = 10
var applyListArr = []
var status = '0'
var formId
var id
var userId
var bottomLast = false
const photoPrefix = 'https://pic.linchongpets.com/';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    chosenId: 1,
    showFilter: false,
    photoPrefix: photoPrefix
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    applyListArr = []
    status = '0'
    this.getApplyList()
  },

  chooseTab: function(e) {
    var that = this
    var chosenId = e.currentTarget.dataset.id;
    if (chosenId == 1) {
      status = '0'
    } else if (chosenId == 2) {
      status = '1,2,3'
    } else if (chosenId == 3) {
      status = '4'
    } else if (chosenId == 4) {
      status = '5'
    }
    this.setData({
      applyList: [],
      showLoading: true,
      chosenId: chosenId,
    })
    applyListArr = []
    pageNum = 1
    bottomLast = false
    this.getApplyList()
  },

  getApplyList: function() {
    var that = this
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/apply/list',
      data: {
        applyStatus: status,
        pageNum: pageNum,
        pageSize: pageSize
      },
      method: "GET",
      success: function(res) {
        var applyList = res.data.data.rows
        bottomLast = false
        if (applyList.length < pageSize) {
          bottomLast = true
        }

        for (var i = 0; i < applyList.length; i++) {
          applyList[i].nickName = applyList[i].nickName.substring(0, 5)
        }

        applyListArr = applyListArr.concat(applyList)
        that.setData({
          applyList: applyListArr,
          showLoading: false,
          bottomLast: bottomLast
        })
      }
    })
  },
  detail: function(e) {
    var applyId = e.currentTarget.dataset.applyid
    wx.navigateTo({
      url: '../applydetail/applydetail?applyId=' + applyId,
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
    pageNum = 1
    bottomLast = false
    applyListArr = []
    this.getApplyList()
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    //刷新页面
    if (!bottomLast) {
      pageNum++;
      that.getApplyList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})