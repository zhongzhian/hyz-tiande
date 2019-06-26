// pages/card/addTicket/addTicket.js
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
    couponId: "",
    interval: 0,
    hasPick: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let couponId = options.couponId;
    // couponId = "8aaa15fe6ac53081016ac5fd87480000";
    let q = options.q;
    if (q) {
      let url = decodeURIComponent(q);
      let urlarr = url.split('/');

      couponId = urlarr[urlarr.length - 1];
    }
    
    if (couponId) {
      this.setData({
        couponId: couponId
      })

      var that = this;
      var interval = setInterval(function() {
        let hyz_userinfo = app.getHyzUserInfo();
        if (hyz_userinfo) {
          clearInterval(that.data.interval);
          that.fetchTicket();
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
  fetchTicket() {
    let hyz_userinfo = app.getHyzUserInfo();
    app.wechat.fetchAPI('GET', app.api.COMMON_API.card.COUPON + '/' + this.data.couponId).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let _hasPick = false;
          if (res.data.hyz_result.status === "1"){
            _hasPick = true;
          }
          this.setData({
            spinShow: false,
            ticketInfo: res.data.hyz_result,
            hasPick: _hasPick
          })
          // this.fetchMyTicket();
        }
      }
    });
  },
  fetchMyTicket() {
    let hyz_userinfo = app.getHyzUserInfo();
    let params = {
      "searchParas": {
        "conditions": [{
          "name": "person",
          "op": "eq",
          "type": "int",
          "value": hyz_userinfo.id
        }, {
          "name": "couponTypeId",
          "op": "eq",
          "type": "int",
          "value": this.data.ticketInfo.couponTypeId
        }],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.COUPON_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let hasPick = (res.data.hyz_result.totalNum > 0);
          this.setData({
            spinShow: false,
            hasPick: hasPick
          })
        }
      }
    });
  },
  doPick() {
    this.getApiTicket();
  },
  getApiTicket() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.common.API_TICKET + "/1").then(res => {
      if (res.data.hyz_code === 20000) {
        this.addCard(this.data.ticketInfo.couponKey, res.data.hyz_result);
      }
    });
  },
  addCard(card_id, api_ticket) {
    let that = this;
    var timestampStr = parseInt(new Date().getTime() / 1000) + '',
      nonce_Str = 'TianDe' + timestampStr;
    var arr = [api_ticket, timestampStr, nonce_Str, card_id]
    arr = arr.sort();
    var str = '';
    for (var i = 0; i < arr.length; i++) {
      str += arr[i];
    }
    var signatureStr = app.appUtil.sha1(str);
    // signatureStr = '2c1a2fbab92f9053f78a70e002b0348a0ce280bf';
    console.log("signatureStr", signatureStr);
    // return;
    var cardExt = {
      timestamp: timestampStr,
      nonce_str: nonce_Str,
      signature: signatureStr
    }
    wx.addCard({
      cardList: [{
        cardId: card_id,
        cardExt: JSON.stringify(cardExt)
      }],
      success(res) {
        console.log('卡券添加结果success：', res) // 卡券添加结果
        if (res.cardList) {
          for (var card of res.cardList) {
            console.log("card:", card);
            if (card.isSuccess) {
              //TODO 
              that.addHyzTicket(card);
            }
          }
        }
      },
      fail(res) {
        console.log('卡券添加结果fail：', res) // 卡券添加结果
      },
      complete(res) {
        console.log('卡券添加结果complete：', res) // 卡券添加结果
      }
    })
  },
  addHyzTicket(card) {
    let hyz_userinfo = app.getHyzUserInfo();
    let params = {
      "couponCode": card.code,
      "couponId": this.data.couponId
    };
    app.wechat.fetchAPI('PUT', app.api.COMMON_API.card.COUPON_RECEIVE, params).then(res => {
      if (res.data.hyz_code === 20000) {
        $Toast({
          content: '领取优惠券成功',
          type: 'success'
        });
        this.backToHome();
      }
    });
  },
  backToHome() {
    wx.redirectTo({
      url: "../../welcome/welcome?from=addticket",
      success: function(res) {
        console.log("跳转成功:" + JSON.stringify(res));
      }
    });
  }
})