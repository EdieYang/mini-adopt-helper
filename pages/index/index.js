
const app = getApp()
var chainId

Page({
  data: {
    userInfo:'',
    chainName:'',
    chooseTab:1,
    couponItemCode:''
  },
  onLoad: function () {
    var that=this
   var userInfo=app.globalData.userInfo
   chainId=userInfo.chainId
    wx.request({
      url: app.globalData.requestUrlCms + '/sysOrg/chains/chain',
      data: {
        chainId: chainId
      },
      method: "GET",
      success: function (res) {  
        that.setData({
          chainName:res.data.data.chainName,
          userInfo:userInfo
        })
      }
    })

    this.listCheckedCouponList()
  },
  chooseTab:function(e){
    var index=e.currentTarget.dataset.index
    this.setData({
      chooseTab:index
    })
  },
  scanCode:function(){
    var that=this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.pageScrollTo({
          scrollTop: 60,
          duration: 300
        })
        console.log(res)
        if (res.scanType =='QR_CODE' && res.result!=''){
            //查询二维码id
          console.log(res.result)
          wx.request({
            url: app.globalData.requestUrlCms + '/couponItems/coupon',
            data: {
              couponItemId: res.result
            },
            method: "GET",
            success: function (res) {
              console.log(res)
              var coupon=res.data.data
              var couponRules = JSON.parse(coupon.couponRule)
              coupon.couponRule=couponRules
              that.setData({
                coupon: coupon,
                couponItemCode:''
              })
            }
          })

        }
      }
    })
  },
  checkCoupon:function(){
    var that=this
    wx.showLoading({
      title: '正在处理...',
    })
    var couponItemId = this.data.coupon.couponItemId
    wx.request({
      url: app.globalData.requestUrlCms + '/couponItems/coupon',
      data: {
        couponItemId: couponItemId,
        certifyChainId: chainId
      },
      method: "PUT",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if(res.data.data!=null ){
          wx.showToast({
            title: '核销成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '核销失败',
            duration: 2000
          })
        }

        that.setData({
          coupon: null
        })
        that.listCheckedCouponList()



      }
       
    })

  },
  listCheckedCouponList:function(){
    var that=this;
    wx.request({
      url: app.globalData.requestUrlCms + '/couponItems/chain',
      data: {
        certifyChainId:chainId
      },
      method: "GET",
      dataType: "json",
      success: function (res) {
        console.log(res)
       that.setData({
         couponList:res.data.data
       })
      }
    })
  },
  searchCouponCode:function(e){
    var that = this
    var value = e.detail.value
    if (value.length==0){
      this.setData({
        coupon:null
      })
      return
    }else if(value.length!=32){
      return
    }
    wx.showLoading({
      title: '查询中',
    })
    wx.request({
      url: app.globalData.requestUrlCms + '/couponItems/coupon',
      data: {
        couponItemId: value
      },
      method: "GET",
      dataType: "json",
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        var coupon = res.data.data
        if(coupon==null){
          that.setData({
            coupon:null
          })
          wx.showToast({
            title: '未查询到优惠券！',
            duration:3000,
            icon: 'none'
          })
          return
        }
        wx.pageScrollTo({
          scrollTop: 60,
          duration: 300
        })
        var couponRules = JSON.parse(coupon.couponRule)
        coupon.couponRule = couponRules
        that.setData({
          coupon: coupon
        })
      }
    })
  }
})
