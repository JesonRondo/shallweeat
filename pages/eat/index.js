//index.js
//获取应用实例
Page({
  data: {
    motto: '',
    isRoll: false,
    rollTimes: 0,
    st: 'begin',
    btnSt: 'st1'
  },
  onLoad () {
    wx.setNavigationBarTitle({
      title: '放(xia)学(ban)吃什么'
    })
  },
  emitSt () {
    var st = 'ing'
    if (this.data.rollTimes > 5) {
      st = 'over'
    } else if (!this.data.isRoll) {
      st = 'begin'
    } else {
      st = 'ing'
    }
    this.setData({
      st: st
    })
  },
  emitBtnSt () {
    var btnSt = 'st4'
    if (!this.data.isRoll) {
      btnSt = 'st1'
    } else if (this.data.rollTimes <= 1) {
      btnSt = 'st2'
    } else if (this.data.rollTimes <= 5) {
      btnSt = 'st3'
    } else {
      btnSt = 'st4'
    }
    this.setData({
      btnSt: btnSt
    })
  },
  roll: function (from, to) {
    if (to === from) {
      return to
    }
    if (to < from) {
      from = [to, to = from][0]
    }
    return Math.round(Math.random() * (to - from)) + from
  },
  go: function () {
    // 好多重复点击，不知道是不是bug，加个锁先
    var that = this
    if (that.lock) return
    that.lock = true

    this.setData({
      isRoll: true,
      rollTimes: this.data.rollTimes + 1,
      motto: this.getNavigator()
    })

    this.emitSt()
    this.emitBtnSt()

    setTimeout(function () {
      that.lock = false
    }, 300)
  },
  getVip: function () {
    this.setData({
      st: 'vip',
      btnSt: 'st5'
    })
  },
  useVip: function () {
    this.setData({
      motto: '',
      isRoll: false,
      rollTimes: 0,
      st: 'begin',
      btnSt: 'st1'
    })
  },
  getNavigator: function () {
    var crossStreet
    var shopSort
    var forkTimes
    var turnInfo = []
    var msg = ''
    var isEvening = (new Date().getHours() >= 16)
    crossStreet = this.roll(0, 1)
    shopSort = this.roll(1, 8)
    forkTimes = this.roll(0, isEvening ? 2 : 1) // 中午时间短，需要近一点
    for (let i = 0; i < forkTimes; i++) {
      turnInfo.push({
        sort: this.roll(1, 2),
        isLeft: this.roll(0, 1)
      })
    }
    var turnInfoLen = turnInfo.length
    for (let i = 0; i < turnInfoLen; i++) {
      var direction = turnInfo[i].isLeft ? '左转' : '右转'
      msg += '直走到第' + turnInfo[i].sort + '个' + direction + '路口' + direction + '\n'
      if (i !== turnInfoLen - 1) {
        msg += '然后'
      }
    }
    if (crossStreet) {
      msg += '过街后'
    }
    msg += '一直直走路边第' + shopSort + '家'
    return msg
  }
})
