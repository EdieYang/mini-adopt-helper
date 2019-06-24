var requestUrl;
App({
  globalData: {
    authorized: false,
    userInfo: null,
    userId: '',
      // requestUrlWechat: 'http://localhost:8091/lpWechat',
    requestUrlCms: 'https://www.linchongpets.com/lpCms',
    requestUrlWechat: 'https://www.linchongpets.com/lpWechat',
    // requestUrlCms: 'http://localhost:8093/lpCms',
    // requestUrlCms: 'http://localhost:8093/lpCms',
    // requestUrlWechat: 'http://localhost:8094/lpWechat',
    //  requestUrlCms: 'http://localhost:8093/lpCms',
    // requestUrlWechat: 'http://localhost:8094/lpWechat',
  },
  onLaunch: function(options) {
    console.log("linkpets.miniapp.launching.....")
    var that = this
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })
  },
  IfAccess: function() {
    var that = this
    return new Promise(function(resolve, reject) {
      var userId = wx.getStorageSync("userId")
      //put userId into global variable dataset
      that.globalData.userId = userId;
      //define api request url
      requestUrl = that.globalData.requestUrlWechat;
      // debugger
      wx.checkSession({
        success: function() {
          if (userId && typeof(userId) != 'undefined' && userId != '') {
            that.checkIfUserAuthorized(userId, resolve);
          } else {
            //do login progress to get openId
            that.doLogin(resolve);
          }
        },
        fail: function() {
          // session_key invalid and do relogin progress
          that.doLogin(resolve);
        }
      })
    })
  },

  doLogin: function(resolve) {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          //register new temp user
          wx.request({
            url: requestUrl + '/wxmini/sysUser/login',
            method: "GET",
            data: {
              code: res.code
            },
            dataType: "json",
            success: function(res) {
              // debugger
              const userId = res.data.data.userId;
              const openId = res.data.data.openId;
              if (userId && typeof(userId) != 'undefined' && userId != '') {
                that.globalData.openId = openId
                that.checkIfUserAuthorized(userId, resolve);
              } else {
                console.log("服务器配置微信环境出错，请检查APPID和APPSECRT是否匹配！")
              }
            }
          })
        } else {
          //reboot miniapp
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  checkIfUserAuthorized: function(userId, resolve) {
    var that = this
    wx.request({
      url: requestUrl + '/wxmini/sysUser/checkIfSysUserAuthorized',
      method: "GET",
      data: {
        userId: userId
      },
      dataType: "json",
      success: function(res) {
        // debugger
        var resData = res.data.data;
        that.globalData.authorized = resData.authorized
        if (resData.authorized) {
          that.globalData.userInfo = resData.userInfo;
          that.globalData.userId = resData.userInfo.userId;
          wx.setStorageSync("userId", userId);
        } else {
          wx.setStorageSync("userId", userId);
          that.globalData.userId = userId;
        }
        resolve(true);
      }
    })
  }

})