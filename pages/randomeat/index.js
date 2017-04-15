Page({
    data: {
        motto: '准备好了吗？',
        clicked: false,
        num: 1,
        kinds: [
            '梅干菜骚饼',
            '油泼面',
            '龙虾盖浇饭',
            '豆腐年糕',
            '蛋炒饭'
        ]
    },
    onLoad:function() {
        wx.setNavigationBarTitle({
            title: '放(xia)学(ban)吃什么'
        })

        let that = this
        wx.request({
          url: 'https://heyai.me/api/eatmenu',
          data: {},
          method: 'GET',
          success: function(res){
            // success
            if (res.statusCode === 200 && res.data) {
              that.setData({
                  kinds: res.data
              })
            }
          }
        })
    },
    go: function() {
        this.setData({
            clicked: true
        })

        let kind = this.data.kinds[Math.random() * this.data.kinds.length >>> 0]
        let num = this.data.num
        const code = ' combo x'

        if (this.data.motto.split(code)[0] === kind) {
            num++
            kind += code + num
        } else {
            num = 1
        }

        this.setData({
            motto: kind,
            num: num
        })
    }
})