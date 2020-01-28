const app = getApp()
var userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statisticData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  getStatisticData:function(){
    var that=this
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/statistic/today',
      method: "GET",
      success: function (res) {
        that.setData({
          statisticData: res.data.data
        })
      }
    })
  },
  toAdoptionCheck:function(){
    wx.navigateTo({
      url: '../adoption/adoption',
    })
  },  
  toAuthorizeCheck: function () {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },  
  toApplyCheck: function () {
    wx.navigateTo({
      url: '../apply/apply',
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
    this.getStatisticData();
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