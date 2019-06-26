// pages/carpark/nonumout/nonumout.js
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
    payStatus: "0", //缴费状态 0-未付款 1-已付款 2-部分付款 ,
    spinShow: true,
    interval: null,
    parkGate: "",
    intime: "",
    carnum: "",
    recordInfo:{},
    payment:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let gate = "未知";
    // 根据参数知道是几号闸机
    let q = options.q;
    if (q) {
      let url = decodeURIComponent(q);
      let urlarr = url.split('/');

      gate = urlarr[urlarr.length - 1];
    }

    var that = this;
    var interval = setInterval(function () {
      let hyz_userinfo = app.getHyzUserInfo();
      if (hyz_userinfo) {
        clearInterval(that.data.interval);
        that.setData({
          parkGate: gate
        })
        that.getPayStatus();
      }
    }, 100)

    that.setData({
      interval: interval
    })
  },
  getPayStatus() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.GETMY_NONUM).then(res => {
      // {
      //   "hyz_code": 20000,
      //     "hyz_message": "服务调用成功",
      //       "hyz_result": "临6YTNOH"
      // }
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            recordInfo: res.data.hyz_result,
            payment: res.data.hyz_result.payment,
            outtime: app.appUtil.formatTime(new Date())
          })
        }
      }
      this.setData({
        spinShow: false
      })
    // }).then(res => {

    });
  },
  confirmCarnum(e) {
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type;
    app.dealFormIds(formId);

    switch (type) {
      case "goPay":
        app.wechat.navigatorTo('../payfee/payfee');
        break;
      case "openGate":
        this.openGate();
        break;
    }
  },
  openGate() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.OPEN_GATE + this.data.parkGate).then(res => {
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
      url: "../../welcome/welcome?from=nonum",
      success: function (res) {
        console.log("跳转成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("跳转失败:" + JSON.stringify(res));
      },
      complete: function (res) {
        console.log("跳转complete:" + JSON.stringify(res));
      }
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