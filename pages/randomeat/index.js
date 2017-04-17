Page({
    data: {
        motto: '准备好了吗？',
        clicked: false,
        kinds: [ // default
            '梅干菜骚饼',
            '油泼面',
            '龙虾盖浇饭',
            '豆腐年糕',
            '蛋炒饭'
        ],
        rank: [],
        top: []
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
    rankExist(rank, kind) {
        for (
            let i = 0, len = rank.length;
            i < len;
            i++
        ) {
            if (rank[i].name === kind) {
                return true
            }
        }
        return false
    },
    updateRank(rank, kind) {
        if (this.rankExist(rank, kind)) {
            for (
                let i = 0, len = rank.length;
                i < len;
                i++
            ) {
                if (rank[i].name === kind) {
                    rank[i].num++
                    break;
                }
            }
            rank = rank.sort((a, b) => a.num < b.num)
        } else {
            rank.push({
                name: kind,
                num: 1
            })
        }
        return rank
    },
    searchRank(rank, kind) {
        for (
            let i = 0, len = rank.length;
            i < len;
            i++
        ) {
            if (rank[i].name === kind) {
                return rank[i].num
            }
        }
        return 1
    },
    go: function() {
        this.setData({
            clicked: true
        })

        let kind = this.data.kinds[Math.random() * this.data.kinds.length >>> 0]

        let rank = this.data.rank
        rank = this.updateRank(rank, kind)
        
        let num = this.searchRank(rank, kind)
        this.setData({
            motto: kind + (num > 1 ? ' combo x' + num : ''),
            top: rank.slice(0, 3)
        })
    }
})