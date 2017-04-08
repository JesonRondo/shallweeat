Page({
    onLoad:function() {
        wx.connectSocket({
            url: 'wss://heyai.me:7773'
        })
    }
})