// pages/home/visitor/visitor.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  apply() {
    app.wechat.navigatorTo('../../card/apply');
  },
  addCard() {
    var timestampStr = parseInt(new Date().getTime() / 1000),
      code = '',
      card_id = 'plqmg1TkH47s9mABEkqxjBVUbbdA',
      api_ticket = '9KwiourQPRN3vx3Nn1c_iT9XFMmcOsnIohwM65r8-orbuyhcwlg81iHZfMMfeKRMGD2W4yp5H0CNYbo__hA7jw',
      nonce_str = 'Zhong' + timestampStr;
    var arr = [card_id, api_ticket, nonce_str, timestampStr]
    arr = arr.sort();
    var str = '';
    for (var i = 0; i < arr.length; i++) {
      str += arr[i];
    }
    var signatureStr = app.appUtil.sha1(str);
    var cardExt = {
      timestamp: timestampStr,
      nonce_str: nonce_str,
      signature: signatureStr
    }
    wx.addCard({
      cardList: [{
        cardId: card_id,
        cardExt: JSON.stringify(cardExt)
      }],
      success(res) {
        console.log('卡券添加结果', res) // 卡券添加结果
      },
      fail(res) {
        console.log('卡券添加结果', res) // 卡券添加结果
      },
      complete(res) {
        console.log('卡券添加结果', res) // 卡券添加结果
      }
    })
  },
  // 取车
  searchCar() {
    app.wechat.navigatorTo('../../carpark/search/search');
  },
  // 无牌车
  doScan() {
    // $Toast({
    //   content: '解析中',
    //   type: 'loading'
    // });
    app.wechat.scanCode().then(res => {
      console.log(res);
    })
  },
  // 我的车辆
  myCar() {

  },
  // 我的车位
  myCarSeat() {

  },
  // 邀请访客
  invite() {
    app.wechat.navigatorTo('../visitor/invite');
  },
  // 我邀请的访客
  myInvite() {

  },
  // 缴费
  payFee() {

  },
  // 缴费记录
  payRecord() {

  },
  // 发票管理
  invoice() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
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