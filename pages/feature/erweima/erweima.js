// pages/feature/erweima/erweima.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
const QRCode = require('../../../utils/qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: 250,
    imageHeight: 250,
    qrcode: null,
    spinShow: true,
    interval: null,
    codeInterval: null,
    errorMsg:""
  },

  imageLoad: function(e) {
    let imageSize = app.appUtil.imageUtil(e);
    this.setData({
      imageWidth: imageSize.imageWidth,
      imageHeight: imageSize.imageHeight,
    })
  },
  flashCode() {
    clearInterval(this.data.codeInterval);
    this.setCodeInterval();
    this.getQrCodeText();
  },
  getQrCodeText() {
    let params = {};
    this.setData({
      spinShow: true
    })
    app.wechat.fetchAPI('POST', app.api.COMMON_API.common.QRCODE, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // var timestampStr = new Date().getTime() + "";
          // timestampStr = timestampStr + Math.random(10000000);
          console.log("二维码::::::::::;", res.data.hyz_result);
          // qrcode.makeCode(timestampStr);
          if (!this.data.qrcode) {
            let qrcode = new QRCode('canvas', {
              text: "code=00000000000",
              width: 250,
              height: 250,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H,
            });
            this.setData({
              qrcode: qrcode
            })
          }
          this.data.qrcode.makeCode(res.data.hyz_result);
          this.setData({
            spinShow: false
          })
        }
      }else{
        this.setData({
          errorMsg: res.data.hyz_message,
          spinShow: false
        })
      }
    });
  },
  setCodeInterval() {
    var that = this;
    let codeInterval = setInterval(function() {
      that.getQrCodeText();
    }, 5000)
    console.log("----------------- erweima:onShow")
    that.setData({
      codeInterval: codeInterval
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setCodeInterval();
    this.getQrCodeText();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("----------------- erweima:onHide")
    clearInterval(this.data.codeInterval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("----------------- erweima:onUnload")
    clearInterval(this.data.codeInterval);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onLoad: function() {
    console.log("----------------- erweima:onLoad")
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onReady: function() {
    console.log("----------------- erweima:onReady")
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