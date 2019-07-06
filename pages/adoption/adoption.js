const photoPrefix = 'https://melody.memorychilli.com/';

const app = getApp()
var userId
var pageNum = 1
var pageSize = 10
var petInfoListArr = []
var adoptStatus = 0
var bottomLast=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoPrefix: photoPrefix,
    showLoading: true,
    chosenId: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    userId = app.globalData.userId
  },
  chooseTab: function(e) {
    var that = this
    var chosenId = e.currentTarget.dataset.id;
    if (chosenId == 1) {
      adoptStatus = '0'
    } else if (chosenId == 2) {
      adoptStatus = '1'
    } else if (chosenId == 3) {
      adoptStatus = '2,3,4'
    }
    this.setData({
      showLoading: true,
      chosenId: chosenId,
    })
    petInfoListArr = []
    this.getPetAdoptList()

  },

  getPetAdoptList: function() {
    var that = this
    wx.request({
      url: app.globalData.requestUrlCms + '/adopt/pets/list',
      data: {
        adoptStatus: adoptStatus,
        pageNum: pageNum,
        pageSize: pageSize
      },
      method: "GET",
      success: function(res) {
        var petInfoList = res.data.data.list
        bottomLast = false
        if (petInfoList.length < pageSize) {
          bottomLast = true
        }
        for (var i = 0; i < petInfoList.length; i++) {
          petInfoList[i].petCharacteristic = JSON.parse(petInfoList[i].petCharacteristic)
        }
        petInfoListArr = petInfoListArr.concat(petInfoList)
        that.setData({
          petInfoList: petInfoListArr,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    petInfoListArr = []
    this.getPetAdoptList()
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
      this.getPetAdoptList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})