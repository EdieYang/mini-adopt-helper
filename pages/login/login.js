const app = getApp()
var userId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    skipHiddenItemLayout: true,
    focus1: true,
    focus1_: false,
    focus2: false,
    focus3: false,
    focus4: false,
    hasInput1: false,
    hasInput2: false,
    hasInput3: false,
    hasInput4: false,
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    showCode: true,
    showOrgList: false,
    showNext: false,
    wrongCode: false,
    orgId: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    userId=app.globalData.userId
  },


  doLogin: function(orgCode) {
    var that = this
    wx.showLoading({
      mask: true,
      title: '校验中',
    })
    wx.request({
      url: app.globalData.requestUrlCms + '/sysOrg',
      data: {
        orgCode: orgCode,
      },
      method: "GET",
      dataType: "json",
      success: function(res) {
        console.log(res.data)
        if (res.data.data != null && res.data.data.orgId != '') {
          // debugger
          wx.hideLoading();
          that.setData({
            showOrgList: true,
            showCode: false,
            orgId: res.data.data.orgId
          })


          wx.request({
            url: app.globalData.requestUrlCms + '/sysOrg/chains',
            data: {
              orgId: that.data.orgId,
              chainName: ''
            },
            method: "GET",
            dataType: "json",
            success: function (res) {
              console.log(res.data)
              if (res.data.data != null) {
                that.setData({
                  chainList: res.data.data
                })
              }
            }
          })


        } else {
          wx.hideLoading();
          that.setData({
            focus1: true,
            focus1_: false,
            focus2: false,
            focus3: false,
            focus4: false,
            focus1_: false,
            focus2_: false,
            focus3_: false,
            focus4_: false,
            hasInput1: false,
            hasInput2: false,
            hasInput3: false,
            hasInput4: false,
            input1: '',
            input2: '',
            input3: '',
            input4: '',
            wrongCode: true
          })
        }
      }
    })
  },
  bindKeyInput(e) {
    var index = e.target.dataset.index

    console.log(index)
    if (e.detail.value != '') {
      if (index == 1) {
        this.setData({
          focus1: false,
          focus3: false,
          focus4: false,
          focus1_: true,
          hasInput1: true,
          input1: e.detail.value
        })
        var that = this
        setTimeout(function() {
          that.setData({
            focus2: true,
          })
        }, 50)

      } else if (index == 2) {
        this.setData({
          focus1: false,
          focus2: false,
          focus4: false,
          focus2_: true,
          hasInput2: true,
          input2: e.detail.value
        })
        var that = this
        setTimeout(function() {
          that.setData({
            focus3: true,
          })
        }, 50)
      } else if (index == 3) {
        this.setData({
          focus1: false,
          focus2: false,
          focus3: false,
          focus3_: true,
          hasInput3: true,
          input3: e.detail.value
        })

        var that = this
        setTimeout(function() {
          that.setData({
            focus4: true,
          })
        }, 50)
      } else {
        this.setData({
          focus4_: true,
          hasInput4: true
        })
        var orgCode = this.data.input1 + '' + this.data.input2 + '' + this.data.input3 + '' + e.detail.value
        //执行校验
        this.doLogin(orgCode)
      }

    } else {

      if (index == 1) {
        this.setData({
          focus1: true,
          focus1_: false
        })
      } else if (index == 2) {
        this.setData({
          focus2: false,
          focus3: false,
          focus4: false,
          focus2_: false,
          hasInput1: false
        })
        var that = this
        setTimeout(function() {
          that.setData({
            focus1: true,
          })
        }, 50)
      } else if (index == 3) {
        this.setData({
          focus1: false,
          focus3: false,
          focus4: false,
          focus3_: false,
          hasInput2: false
        })
        var that = this
        setTimeout(function() {
          that.setData({
            focus2: true,
          })
        }, 50)
      } else {
        this.setData({
          focus1: false,
          focus2: false,
          focus4: false,
          focus4_: false,
          hasInput3: false
        })
        var that = this
        setTimeout(function() {
          that.setData({
            focus3: true,
          })
        }, 50)
      }
    }
  },

  searchChain: function(e) {
    var that = this
    var value = e.detail.value
    wx.request({
      url: app.globalData.requestUrlCms + '/sysOrg/chains',
      data: {
        orgId: this.data.orgId,
        chainName: value
      },
      method: "GET",
      dataType: "json",
      success: function(res) {
        console.log(res.data)
        if (res.data.data != null) {
          that.setData({
            chainList: res.data.data
          })
        }
      }
    })
  },

  goChain: function(e) {
    var that = this
    // debugger
    var chainId = e.currentTarget.dataset.chainid
    this.bindSysUserToChain(chainId)
  },
  bindSysUserToChain:function(chainId){
    // debugger
    wx.showLoading({
      title: '正在入驻',
    })
    if (chainId!=''){
      wx.request({
        url: app.globalData.requestUrlCms + '/sysUser/user',
        data: {
          userId: userId,
          chainId: chainId
        },
        method: "PUT",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          wx.hideLoading()
          // debugger
          if (res.data.data != null) {
            app.globalData.userInfo=res.data.data
            wx.redirectTo({
              url: '../index/index',
            })
          }
        }
      })
    }
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

  },
  // getPhoneNumber: function(e) {
  //   var that = this
  //   console.log(e.detail.errMsg)
  //   var iv = e.detail.iv
  //   var encryptedData = e.detail.encryptedData
  //   wx.showLoading({
  //     title: '绑定中',
  //     mask: true
  //   })
  //   userId = app.globalData.userId;
  //   //login
  //   wx.login({
  //     success: res => {
  //       if (res.code) {
  //         //register new temp user
  //         wx.request({
  //           url: app.globalData.requestUrlWechat + '/wxmini/sysUser/login',
  //           method: "GET",
  //           data: {
  //             code: res.code
  //           },
  //           dataType: "json",
  //           success: function(res) {

  //             const userId = res.data.data.userId;
  //             const openId = res.data.data.openId;
  //             const sessionKey = res.data.data.sessionKey;
  //             if (userId && typeof(userId) != 'undefined' && userId != '') {
  //               //授权回调函数获取用户详情    
  //               wx.request({
  //                 url: app.globalData.requestUrlWechat + '/wxmini/sysUser/authorizeUserPhoneNumber/' + userId,
  //                 data: {
  //                   encryptedData: encryptedData,
  //                   iv: iv,
  //                   sessionKey: sessionKey
  //                 },
  //                 dataType: "json",
  //                 method: "POST",
  //                 success: function(res) {
  //                   debugger
  //                   var userInfo = res.data.data.userInfo
  //                   if (userInfo != null) {
  //                     app.globalData.userInfo = userInfo
  //                   }

  //                   wx.hideLoading();
  //                   that.setData({
  //                     showOrgList: true,
  //                     showCode: false,
  //                     showNext: false
  //                   })

  //                 }
  //               })

  //             } else {
  //               wx.showToast({
  //                 title: '微信功能报错,请稍后再试',
  //                 duration: 100000,
  //                 mask: true,
  //               })
  //               console.log("服务器配置微信环境出错，请检查APPID和APPSECRT是否匹配！")
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })

  // },
})