const util = require('../../utils/util.js')

const app = getApp()
var userId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekday: '',
    nowTime: '',
    showAuthBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.showClock()
    var mydate = new Date();
    var myddy = mydate.getDay(); //获取存储当前日期
    var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    this.setData({
      weekday: weekday[myddy]
    })
    setInterval(function() {
      that.showClock()
    }, 1000)

    wx.showLoading({
      title: '校验信息'
    })
    //登录获取用户信息
    app.IfAccess().then(function(res) {
      wx.hideLoading()
      if (res) {
        var authorized = app.globalData.authorized
        var userInfo = app.globalData.userInfo

        if (!authorized) {
          that.setData({
            showAuthBtn: true
          })
        } else if (authorized && userInfo != null && userInfo.chainId != null) {
          setTimeout(function() {
            wx.redirectTo({
              url: '../adoption/adoption'
            })
          }, 1000)

        } else {

          setTimeout(function() {
            wx.redirectTo({
              url: '../login/login'
            })
          }, 1000)
        }
      }
    })

  },
  bindGetUserInfo: function() {
    wx.showLoading({
      title: '授权中',
      mask: true
    })
    userId = app.globalData.userId;
    //login
    wx.login({
      success: res => {
        if (res.code) {
          //register new temp user
          wx.request({
            url: app.globalData.requestUrlWechat + '/wxmini/sysUser/login',
            method: "GET",
            data: {
              code: res.code
            },
            dataType: "json",
            success: function(res) {

              const userId = res.data.data.userId;
              const openId = res.data.data.openId;
              const sessionKey = res.data.data.sessionKey;
              if (userId && typeof(userId) != 'undefined' && userId != '') {
                //授权回调函数获取用户详情    
                wx.getUserInfo({
                  withCredentials: true,
                  success: function(res) {
                    console.log(res);

                    if (res.errMsg == "getUserInfo:ok") {
                      //decrypt encrypeted userInfo
                      wx.request({
                        url: app.globalData.requestUrlWechat + '/wxmini/sysUser/authorizeUser/' + userId,
                        data: {
                          encryptedData: res.encryptedData,
                          iv: res.iv,
                          sessionKey: sessionKey
                        },
                        dataType: "json",
                        method: "POST",
                        success: function(res) {
                          // debugger
                          var userInfo = res.data.data.userInfo
                          if (userInfo != null) {
                            app.globalData.authorized = true
                          }
                          app.globalData.userInfo = userInfo
                          wx.hideLoading();
                          wx.showToast({
                            title: '授权成功',
                            duration: 2000
                          })
                          wx.redirectTo({
                            url: '../login/login'
                          })

                        }
                      })
                    }
                  },
                  fail: function(res) {
                    console.log(res)
                  }
                })

              } else {
                wx.showToast({
                  title: '微信功能报错,请稍后再试',
                  duration: 100000,
                  mask: true,
                })
                console.log("服务器配置微信环境出错，请检查APPID和APPSECRT是否匹配！")
              }
            }
          })
        }
      }
    })
  },

  showClock: function() {
    var time = new Date();
    var hour = time.getHours()
    var minute = time.getMinutes()
    var second = time.getSeconds()

    this.setData({
      nowTime: hour + ':' + minute + ":" + (second < 10 ? '0' + second : second)
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