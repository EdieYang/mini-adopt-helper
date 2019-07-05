var requestUrl;

App({
  globalData: {
    authorized: false,
    userInfo: null,
    userId: '',
    // requestUrlCms: 'https://www.linchongpets.com/lpCms',
    // requestUrlWechat: 'https://www.linchongpets.com/lpWechat',
    requestUrlCms: 'http://localhost:8093/lpCms',
    requestUrlWechat: 'http://localhost:8094/lpWechat'
  },
  onLaunch: function(options) {
    console.log("linkpets.miniapp.launching.....")
  },
})