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
    errorMsg: "",
    couponTypeId: 0,
    ticketTypeInfo: null,
    ticketInfo: null,
    hasPick:false,
    showFlash:false
  },

  imageLoad: function(e) {
    let imageSize = app.appUtil.imageUtil(e);
    this.setData({
      imageWidth: imageSize.imageWidth,
      imageHeight: imageSize.imageHeight,
    })
  },
  getQrCodeText() {
    let url = app.api.COMMON_API.common.QRCODE_DOMAIN + "coupon/" + this.data.ticketInfo.id;
    // let url = "code=00000000000";
    let qrcode = new QRCode('canvas', {
      text: "code=00000000000",
      width: 250,
      height: 250,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    qrcode.makeCode(url);
    this.checkCode();
    // this.setData({
    //   spinShow: true
    // })
  },
  checkCode(){
    var that = this;
    var codeInterval = setInterval(function () {
      app.wechat.fetchAPI('GET', app.api.COMMON_API.card.COUPON + '/' + that.data.ticketInfo.id).then(res => {
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            let _hasPick = false;
            if (res.data.hyz_result.status === "1") {
              _hasPick = true;
              clearInterval(that.data.codeInterval);
            }
            that.setData({
              hasPick: _hasPick,
              showFlash: true
            })
            // this.fetchMyTicket();
          }
        }
      });
    }, 5000)

    that.setData({
      codeInterval: codeInterval
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onLoad: function(options) {
    let couponTypeId = options.couponTypeId;
    // couponTypeId = "8aaa15fe6ac53081016acf4c29ba0001";
    if (couponTypeId) {
      this.setData({
        couponTypeId: couponTypeId
      })

      var that = this;
      var interval = setInterval(function() {
        console.log("--- interval");
        let hyz_userinfo = app.getHyzUserInfo();
        if (hyz_userinfo) {
          clearInterval(that.data.interval);
          that.fetchTicket();
          // that.getQrCodeText();
        }
      }, 100)

      that.setData({
        interval: interval
      })
    } else {
      this.setData({
        errorMsg: "操作有误，请重新尝试",
        spinShow: false
      })
    }
  },
  fetchTicket() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.card.COUPON_TYPE + '/' + this.data.couponTypeId).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            ticketTypeInfo: res.data.hyz_result
          })
          this.addHyzTicket();
        }
      }
    });
  },
  flashCode(){
    this.addHyzTicket();
  },
  addHyzTicket() {
    let hyz_userinfo = app.getHyzUserInfo();
    let company = app.getHyzUserCompany();
    let ticketTypeInfo = this.data.ticketTypeInfo;
    let params = {
      "couponKey": this.data.ticketTypeInfo.couponKey,
      "couponName": this.data.ticketTypeInfo.couponName,
      "couponTypeId": this.data.ticketTypeInfo.id,
      "description": "",
      // "dueTime": "2019-05-16T14:33:56.359Z",
      "duration": this.data.ticketTypeInfo.duration,
      "companyPerson": hyz_userinfo.id,
      "type": this.data.ticketTypeInfo.type,
      "typeName": this.data.ticketTypeInfo.typeName,
      "status": "0",
      "statusName": "待领取"
    };
    if (hyz_userinfo.rootOrganization) {
      params.company = hyz_userinfo.rootOrganization.id;
      params.companyName = hyz_userinfo.rootOrganization.organizationName;
    }
    if (hyz_userinfo.personName) {
      params.companyPersonName = hyz_userinfo.personName;
    }

    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.COUPON, params).then(res => {
      if (res.data.hyz_code === 20000) {
        this.setData({
          ticketInfo: res.data.hyz_result,
          hasPick:false,
          spinShow: false
        })
        this.getQrCodeText();
        // $Toast({
        //   content: '领取优惠券成功',
        //   type: 'success'
        // });
      }
    });
  },
})