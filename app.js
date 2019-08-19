var requestUrl;

App({
  globalData: {
    authorized: false,
    userInfo: null,
    userId: '',
    requestUrlCms: 'http://linchong.natapp1.cc/lpCms',
    requestUrlWechat: 'http://linchong.natapp1.cc/lpWechat',
    // requestUrlCms: 'http://localhost:8093/lpCms',
    // requestUrlWechat: 'http://localhost:8094/lpWechat'
  },
  onLaunch: function(options) {
    console.log("linkpets.miniapp.launching.....")
  },
})