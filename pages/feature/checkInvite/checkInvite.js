// pages/feature/checkInvite/checkInvite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    code: "",
    invitation: null,
    inviteStatus: 1, // inviteStatus:被邀请人状态，1是未绑定过手机号，2是绑定过且有邀请函，3是绑定过但没有邀请函
    spinShow: false,
    interval: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    // let _start = res.aaa;
    // this.setData({
    //   msg: _start
    // })
    // var that = this;
    // var interval = setInterval(function() {
    //   let hyz_userinfo = app.getHyzUserInfo();
    //   if (hyz_userinfo) {
    //     clearInterval(that.data.interval);
    //   }
    // }, 100)

    // that.setData({
    //   interval: interval
    // })
  },
  confirmInvite(e) {
    let formId = e.detail.formId;
    let formvalue = e.detail.value;
    let hyz_userinfo = app.getHyzUserInfo();

    this.setData({
      phone: formvalue.phone,
    });

    var params = {
      "searchParas": {
        "conditions": [{
            "name": "telphone",
            "op": "eq",
            "type": "string",
            "value": this.data.phone
          },
          {
            "name": "visitorStatus",
            "op": "noeq",
            "type": "int",
            "value": 2
          },
          {
            "name": "visitorStatus",
            "op": "noeq",
            "type": "int",
            "value": 3
          }
        ],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.visitor.VISITOR_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          if (res.data.hyz_result.list.length > 0) {
            // 绑定过有邀请函
            for (var i = 0; i < res.data.hyz_result.list.length; i++) {
              let _visitor = res.data.hyz_result.list[i];
              this.setData({
                invitation: _visitor,
                inviteStatus: 2
              });
            }
          } else {
            // 绑定过但无邀请函
            this.setData({
              inviteStatus: 3
            });
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("--------------------------invitation onReady");
    // this.checkInvite();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("--------------------------invitation onShow");
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