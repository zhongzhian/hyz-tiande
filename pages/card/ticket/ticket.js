// pages/card/ticket/ticket.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: true,
    ticketInfo: null,
    tid: "-----",
    type: "-----"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let tid = options.tid;
    let type = options.type;
    // tid = "8aaabd5e6ac057c1016ac4bfaeb90002";
    // type = "2";
    if (type) {
      this.setData({
        tid: tid,
        type: type
      })
      // this.fetchTicket();
    }
  },
  fetchTicket() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.card.COUPON + '/' + this.data.tid).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // wx.setNavigationBarColor({
          //   frontColor: '#ffffff',
          //   backgroundColor: '#63b359'
          // })
          this.setData({
            ticketInfo: res.data.hyz_result,
            spinShow: false
          })
        }
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