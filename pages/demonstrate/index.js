// pages/demonstrate/index.js
var app = getApp()

Page({
  data:{
    st: 'normal', // normal, sure
    list: [],
    needHelp: false,
    targetID: null,
    waitKey: null
  },
  onLoad:function(){
    var that = this
    wx.setNavigationBarTitle({
      title: '禾一要上传'
    })

    wx.connectSocket({
      url: 'wss://heyai.me:7773'
    })

    wx.onSocketError(function(res){
      console.log('WebSocket连接打开失败，3s后重试！')
      wx.connectSocket({
        url: 'wss://heyai.me:7773'
      })
    })

    app.getUserInfo(function(userInfo){
      if (userInfo.nickName !== 'If🐼'
      && userInfo.nickName !== 'Else🍉') {
        wx.showToast({
          title: '你用不了哦！',
          mask: true,
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },
  onUnload:function() {
    wx.closeSocket()
  },
  help:function () {
    this.setData({
      needHelp: true
    })
  },
  makesure:function() {
    wx.showToast({
      title: '好的！'
    })

    // send key
    wx.sendSocketMessage({
      data: JSON.stringify({
        type: 'permission_key',
        target: this.data.targetID,
        key: this.data.waitKey
      })
    })

    this.setData({
      targetID: null,
      waitKey: null,
      st: 'normal'
    })
  },
  cancel:function() {
    this.setData({
      targetID: null,
      waitKey: null,
      st: 'normal'
    })
  },
  scan:function(){
    let that = this
    wx.scanCode({
      success: function (res) {
        if (res.scanType !== "QR_CODE") {
          wx.showToast({
            title: '求扫二维码'
          })
          return
        }

        let clientData
        try {
          clientData = JSON.parse(res.result)
        } catch (e) {
          return
        }
        wx.showLoading({
          title: '请稍后'
        })

        wx.request({
          url: 'https://heyai.me/api/list',
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            if (res.statusCode === 200) {
              res = res.data
              if (res.ok) {
                const renderList = []
                let waitList = clientData.list
                waitList.forEach(item => {
                  if (res.list.indexOf(item) >= 0) {
                    renderList.push({
                      name: item,
                      type: 'update'
                    })
                  } else {
                    renderList.push({
                      name: item,
                      type: 'new'
                    })
                  }
                })

                if (renderList.length <= 0) return

                that.setData({
                  waitKey: clientData.key,
                  targetID: clientData.wsid,
                  st: 'sure',
                  list: renderList
                })
              }
            }
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
            wx.hideLoading()
          }
        })
      },
      fail: function () {}
    })
  }
})