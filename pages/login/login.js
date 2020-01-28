var decryptUtil = require('../../utils/sha256.js')
var dateUtil = require('../../utils/date.js')

const app = getApp()
var userId


Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '验证身份中',
    })
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo == null || typeof userInfo == 'undefined' || userInfo == '' || userInfo != null && dateUtil.formatDateDiff(userInfo.expire) > 1) {
      wx.hideLoading()
    } else {
      app.globalData.userInfo = userInfo
      wx.redirectTo({
        url: '../home/home',
      })
    }
  },
  login: function(e) {
    var that = this
    var userAccount = e.detail.value.userAccount
    var password = e.detail.value.password
    if (userAccount == '') {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
      return
    }
    if (password == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    password = decryptUtil.sha256(password)
    wx.request({
      url: app.globalData.requestUrlCms + '/sys/login',
      data: {
        userAccount: userAccount,
        password: password
      },
      method: "GET",
      success: function(res) {
        if (res.data.success) {
          var userInfo=res.data.data
          var userId=userInfo.userId
          //获取用户权限
          wx.request({
            url: app.globalData.requestUrlCms + '/sys/login/permission',
            data: {
              userId: userId
            },
            method: "GET",
            success: function (res) {
              if (res.data.data.userRoles[0] != 'MINI_HELP_ADMIN') {
                that.setData({
                  showFilter: true
                })
              } else {
                wx.showLoading({
                  title: '登录中',
                })
                app.globalData.userInfo = userInfo
                userInfo.expire = new Date()
                wx.setStorage({
                  key: 'userInfo',
                  data: userInfo,
                })
                wx.redirectTo({
                  url: '../home/home',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  regitser: function(e) {
    var that = this
    var userAccount = e.detail.value.userAccount
    var password = e.detail.value.password
    var password2 = e.detail.value.password2
    if (userAccount == '') {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
      return
    }
    if (password == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }

    if (password != password2) {
      wx.showToast({
        title: '密码不一致',
        icon: 'none'
      })
      return
    }

    password = decryptUtil.sha256(password)
    wx.request({
      url: app.globalData.requestUrlCms + '/sys/user',
      data: {
        userAccount: userAccount,
        password: password,
        createBy:'MINI_HELPER'
      },
      method: "POST",
      success: function(res) {
        if (res.data.success) {
          wx.showToast({
            title: '注册成功',
            duration: 2000
          })
          that.setData({
            login: true
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  closeFilter: function() {
    this.setData({
      showFilter: false
    })
  },


  toRegister: function() {
    this.setData({
      login: false
    })
  },
  toLogin: function() {
    this.setData({
      login: true
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