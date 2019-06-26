// pages/home/visitor/visitor.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.114510,
    longitude: 113.332861,
    markers: [{
      latitude: 23.114510,
      longitude: 113.332861,
      name: '天德广场'
    }],
    showLocation: true
  },
  searchCar() {
    app.wechat.navigatorTo('../../carpark/search/search');
  },
  doScan() {
    // $Toast({
    //   content: '解析中',
    //   type: 'loading'
    // });
    app.wechat.scanCode().then(res => {
      console.log(res);
    })
  },
  goToTiande(){
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        console.log("res", res);
        const latitude = 23.114510
        const longitude = 113.332861
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success() {
    //           wx.getLocation({
    //             type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
    //             success(res) {
    //               console.log("res", res);
    //               const latitude = 23.114510
    //               const longitude = 113.332861
    //               wx.openLocation({
    //                 latitude,
    //                 longitude,
    //                 scale: 18
    //               })
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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