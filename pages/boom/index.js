// pages/boom/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voiceButtonName: '巴拉巴拉',
    notes: [],
    currentOptIdx: -1,
    storageKey: 'notes',
    atListener: false
  },

  getNotes: function () {
    var notes = wx.getStorageSync(this.data.storageKey);
    if (notes && notes.length > 0) {
      this.setData({
        notes: notes
      })
    }
  },

  addNote: function (msg) {
    var notes = this.data.notes;
    notes.unshift({
      msg: msg,
      status: 'undo'
    });

    wx.setStorageSync(this.data.storageKey, notes);
    this.setData({
      notes: notes
    });
  },

  toggleStatusByIndex: function (idx, status) {
    var notes = this.data.notes;
    var note = notes[idx];

    if (note) {
      if (note.status === 'undo') {
        notes[idx].status = 'done';
      } else {
        notes[idx].status = 'undo';
      }
      wx.setStorageSync(this.data.storageKey, notes);
      this.setData({
        notes: notes
      })
    }
  },

  getStatusByIndex: function (idx) {
    var notes = this.data.notes;
    var note = notes[idx];

    if (note) {
      return note.status;
    }
    return 'undo';
  },

  remoteNoteByIndex: function (idx) {
    var notes = this.data.notes;
    var note = notes[idx];

    if (note) {
      notes.splice(idx, 1);
      wx.setStorageSync(this.data.storageKey, notes);
      this.setData({
        notes: notes
      })
    }
  },

  boomPress: function (e) {
    if (e && e.currentTarget && e.currentTarget.dataset) {
      var idx = e.currentTarget.dataset.index;
      var notes = this.data.notes;

      if (notes.length > idx) {
        this.optIndex(idx);
      }
    }
  },

  optIndex: function (idx) {
    var that = this
    that.setData({
      currentOptIdx: idx
    });

    var status = that.getStatusByIndex(idx);

    wx.showActionSheet({
      itemList: [status === 'undo' ? '标记完成' : '重新打开', '删除备忘'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            that.toggleStatusByIndex(idx);
            break;
          case 1: // 删除
            that.remoteNoteByIndex(idx);
            break;
        }

        that.setData({
          currentOptIdx: -1
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
        that.setData({
          currentOptIdx: -1
        });
      }
    })
  },

  tapVoiceButton: function (event) {
    var that = this
    var start = this.data.voiceButtonName == '巴拉巴拉';
    this.setData({
      voiceButtonName: start ? '聆听中，点击结束' : '巴拉巴拉',
      atListener: start ? true: false
    })
    if (start) {
      wx.startRecord({
        success: function (res) {
          that.setData({
            voiceButtonName: '巴拉巴拉'
          })
          wx.showToast({
            title: '识别中...',
            icon: 'loading',
            duration: 10000,
            mask: true
          })
          wx.uploadFile({
            url: 'https://heyai.me/voice-upload',
            filePath: res.tempFilePath,
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: {
              'msg': 'voice'
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
              // success
              console.log('begin');
              if (res && res.data) {
                var json = JSON.parse(res.data);
                var jsonMsg = JSON.parse(json.msg);

                if (jsonMsg.result && jsonMsg.result.length > 0) {
                  var voiceData = jsonMsg.result.join('');
                  that.addNote(voiceData.replace(/(.*)[\uff0c]$/, '$1'));
                  wx.hideToast();
                } else {
                  that.voiceFail();
                }
              } else {
                that.voiceFail();
              }
            },
            fail: function (err) {
              // fail
              that.voiceFail();
              console.log(err);
            },
            complete: function () {
              // complete
            }
          })
        },
        fail: function (res) {
          that.voiceFail();
        }
      })
      setTimeout(function () {
        //结束录音  
        wx.stopRecord()
      }, 60000)
    } else {
      wx.stopRecord()
    }
  },

  voiceFail: function () {
    wx.hideToast();
    //录音失败
    wx.showToast({
      title: '没听清你说的啥～',
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNotes();
    wx.setNavigationBarTitle({
      title: '闪念胶囊'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})