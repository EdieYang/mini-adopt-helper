var requestUrl;

App({
  globalData: {
    authorized: false,
    userInfo: null,
    userId: '',
    // requestUrlCms: 'http://linchong.natapp1.cc/lpCms',
    // requestUrlWechat: 'http://linchong.natapp1.cc/lpWechat',
    requestUrlCms: 'http://linchongpets.natapp1.cc/lpCmsTest',
    requestUrlWechat: 'http://linchongpets.natapp1.cc/lpWechatTest',
    photoPrefix: 'https://linkpets-adopt-platform-bucket-test.oss-cn-shanghai.aliyuncs.com/'
  },
  onLaunch: function(options) {
    console.log("linkpets.miniapp.launching.....")
  },
})