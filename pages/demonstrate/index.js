// pages/demonstrate/index.js
Page({
  data:{},
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: '禾一要上传'
    })
  },
  scan:function(){
    wx.scanCode({
      success: function (res) {
        if (res.scanType !== "QR_CODE") {
          wx.showToast({
            title: '求扫二维码'
          })
          return
        }

        wx.downloadFile({
          url: res.result,
          success: function (res) {
            console.log(res.tempFilePath)
          }
        })
      },
      fail: function () {}
    })
  }
})