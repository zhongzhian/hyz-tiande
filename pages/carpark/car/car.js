// pages/carpark/car/car.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordInfo: null,
    recordid: "",
    spinShow: true,
    nonumcar: {
      carnum: "临A12345",
      intime: "2019-04-16 12:00:00",
      parkGate: "1号闸机口"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let recordid = options.recordid;
    recordid = "8aaa145e6ad4b1f5016ad8706c6b0004";

    // 如果是线上支付停车费
    if (recordid) {
      this.setData({
        recordid: recordid
      })
      var that = this;
      var interval = setInterval(function () {
        let hyz_userinfo = app.getHyzUserInfo();
        if (hyz_userinfo) {
          clearInterval(that.data.interval);
          that.fetchRecord();
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
  acceptShare() {
    let url = app.api.COMMON_API.parkinglot.ACCEPT_SHARE + this.data.recordid;
    app.wechat.fetchAPI('POST', url).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          $Toast({
            content: '接受成功',
            type: 'success'
          });
          this.backToHome();
        }
      }
      // }).then(res => {

    });
  },
  // 查询当前闸机前车牌
  fetchRecord() {
    let url = app.api.COMMON_API.parkinglot.PARKINGRECORD + '/' + this.data.recordid;
    app.wechat.fetchAPI('GET', url).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            recordInfo: res.data.hyz_result
          })
        }
      }
      this.setData({
        spinShow: false
      })
    });
  },
  backToHome() {
    wx.redirectTo({
      url: "../../welcome/welcome?from=share",
      success: function (res) {
        console.log("跳转成功:" + JSON.stringify(res));
      }
    });
  }
})