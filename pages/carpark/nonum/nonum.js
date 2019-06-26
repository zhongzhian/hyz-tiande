// pages/carpark/nonum/nonum.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation: null,
    carStatus: 1, // carStatus:车辆牌照状态，1是无牌，2是有牌
    spinShow: true,
    interval: null,
    parkGate: "",
    intime: "",
    carnum: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let gate = "";
    // 根据参数知道是几号闸机
    let q = options.q;
    if (q) {
      let url = decodeURIComponent(q);
      let urlarr = url.split('/');

      gate = urlarr[urlarr.length - 1];
    } else if (options.gate){
      gate = options.gate;
    }

    if (gate) {
      var that = this;
      var interval = setInterval(function () {
        let hyz_userinfo = app.getHyzUserInfo();
        if (hyz_userinfo) {
          clearInterval(that.data.interval);
          that.setData({
            parkGate: gate,
            spinShow: false,
            // carnum: res.data.hyz_result,
            carStatus: 1,
            intime: app.appUtil.formatTime(new Date())
          })
          // that.setNum();
        }
      }, 100)

      that.setData({
        interval: interval
      })
    } else {
      this.setData({
        spinShow: false
      })
    }
  },
  // 查询当前闸机前车牌
  setNum() {
    // 地感是否有车
    // 是否有车牌
    // 无牌分配临时牌，手动插入记录；有牌看道闸是否已打开，并展示车牌信息

    // 已确认过，只有无牌车在道闸前才会出现二维码。
    app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.GET_TEMPNO).then(res => {
      // {
      //   "hyz_code": 20000,
      //     "hyz_message": "服务调用成功",
      //       "hyz_result": "临6YTNOH"
      // }
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            spinShow: false,
            carnum: res.data.hyz_result,
            carStatus: 1,
            intime: app.appUtil.formatTime(new Date())
          })
        }
      }
    })
  },
  confirmCarnum(e) {
    let formId = e.detail.formId;
    app.dealFormIds(formId);
    let hyz_userinfo = app.getHyzUserInfo();

    var params = {
      // "entryName": this.data.parkGate,
      "entryNo": this.data.parkGate,
      "entryTime": this.data.intime,
      // "licensePlateNumber": this.data.carnum,
      "person": hyz_userinfo.id,
      "personName": hyz_userinfo.personName,
      "type": "2",
      "typeName": "无牌车小程序入场"
    };
    this.setData({
      spinShow: true
    })
    app.wechat.fetchAPI('POST', app.api.COMMON_API.parkinglot.PARKINGRECORD, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // this.openGate();
          $Toast({
            content: '操作成功',
            type: 'success'
          });
        this.setData({
          carnum: res.data.hyz_result.licensePlateNumber
        })
          // this.backToHome();
        }
      } else {
        $Toast({
          content: res.data.hyz_message,
          type: 'warning'
        });
      }
      this.setData({
        spinShow: false
      })
    })
  },
  openGate(){
    app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.OPEN_GATE+this.data.parkGate).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          $Toast({
            content: '操作成功',
            type: 'success'
          });
          this.backToHome();
        }
      }
    })
  },
  backToHome() {
    wx.redirectTo({
      url: "../../welcome/welcome?frompage=nonum",
      success: function(res) {
        console.log("跳转成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        console.log("跳转失败:" + JSON.stringify(res));
      },
      complete: function(res) {
        console.log("跳转complete:" + JSON.stringify(res));
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})