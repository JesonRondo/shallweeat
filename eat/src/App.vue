<template>
  <div class="container">
    <div class="txt-panel">
      <template v-if="st === 'over'">
        <p>别换了</p>
        <p>你还是自己决定吃什么吧 😩</p>
      </template>
      <template v-if="st === 'begin'">
        <p>Hi, 不知道吃什么的可怜人</p>
        <p>请先站在街边，注意车辆和外星人</p>
        <p>准备好了吗？</p>
      </template>
      <template v-if="st === 'ing'">
        <p>{{motto}}</p>
      </template>
    </div>
    <xbutton v-if="btnSt === 'st1'" type="primary" :bindtap="go">走吧</xbutton>
    <xbutton v-if="btnSt === 'st2'" type="default" :bindtap="go">不想去这里，换一个</xbutton>
    <xbutton v-if="btnSt === 'st3'" type="default" :bindtap="go">不想去这里，再换一个</xbutton>
    <xbutton v-if="btnSt === 'st4'" type="default" :disabled="true" :bindtap="go">不给点</xbutton>
  </view>
</template>

<script>
import Xbutton from './components/Button'

export default {
  components: {
    Xbutton
  },
  computed: {
    st () {
      if (this.rollTimes > 5) {
        return 'over'
      } else if (!this.isRoll) {
        return 'begin'
      } else {
        return 'ing'
      }
    },
    btnSt () {
      if (!this.isRoll) {
        return 'st1'
      } else if (this.rollTimes <= 1) {
        return 'st2'
      } else if (this.rollTimes <= 5) {
        return 'st3'
      } else {
        return 'st4'
      }
    }
  },
  data () {
    return {
      motto: '',
      isRoll: false,
      rollTimes: 0
    }
  },
  methods: {
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

      this.isRoll = true
      this.rollTimes = this.rollTimes + 1
      this.motto = this.getNavigator()

      setTimeout(function () {
        that.lock = false
      }, 300)
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
        msg += '直走到第' + turnInfo[i].sort + '个' + direction + '路口' + direction + '，'

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
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  padding: 40px;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
}
.txt-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.txt-panel p {
  color: #666;
  font-size: 14px;
  line-height: 2;
  text-align: center;
}
</style>
