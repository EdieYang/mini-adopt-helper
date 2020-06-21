var requestUrl;

App({
  globalData: {
    authorized: false,
    userInfo: null,
    userId: '',
    requestUrlCms: 'https://www.linchongpets.com/lpCms',
    requestUrlWechat: 'https://www.linchongpets.com/lpWechat',
    // requestUrlCms: 'http://linchongpets.natapp1.cc/lpCmsTest',
    // requestUrlWechat: 'http://linchongpets.natapp1.cc/lpWechatTest',
    // photoPrefix: 'https://linkpets-adopt-platform-bucket-test.oss-cn-shanghai.aliyuncs.com/'
    photoPrefix: 'https://pic.linchongpets.com/'
  },
  onLaunch: function(options) {
    console.log("linkpets.miniapp.launching.....")
  },
})