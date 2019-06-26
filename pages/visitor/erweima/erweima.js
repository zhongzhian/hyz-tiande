// pages/home/visitor/invitation.js
const app = getApp()
const QRCode = require('../../../utils/qrcode.js')
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
    showLocation: true,
    phone: "",
    code: "",
    invitation: null,
    inviteStatus: 1, // inviteStatus:被邀请人状态，1是未绑定过手机号，2是绑定过且有邀请函，3是绑定过但没有邀请函
    spinShow: true,
    interval: null,
    inviteId: 0,
    invitor: null,
    company: "",
    visitorTime: "",
    visitorStartTime: "",
    visitorEndTime: "",
    imageWidth: 250,
    imageHeight: 250,
    qrcode: null,
    errorMsg: ""
  },
  imageLoad: function(e) {
    let imageSize = app.appUtil.imageUtil(e);
    this.setData({
      imageWidth: imageSize.imageWidth,
      imageHeight: imageSize.imageHeight,
    })
  },
  getQrCodeText() {
    // let qrcode = new QRCode('canvas', {
    //   text: "code=00000000000",
    //   width: 250,
    //   height: 250,
    //   colorDark: "#000000",
    //   colorLight: "#ffffff",
    //   correctLevel: QRCode.CorrectLevel.H,
    // });
    // qrcode.makeCode("http://turbo.linkme8.cn/tiande/card/apply/123");

    let params = {};
    this.setData({
      spinShow: true
    })
    app.wechat.fetchAPI('POST', app.api.COMMON_API.common.QRCODE_BYUID + "/" + this.data.invitation.userId, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          console.log("二维码::::::::::;", res.data.hyz_result);
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
      } else {
        this.setData({
          errorMsg: res.data.hyz_message,
          spinShow: false
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    let _inviteId = res.inviteId;
    // _inviteId = 38331;
    if (_inviteId){
      this.setData({
        inviteId: _inviteId
      })
      var that = this;
      var interval = setInterval(function () {
        let hyz_userinfo = app.getHyzUserInfo();
        if (hyz_userinfo) {
          clearInterval(that.data.interval);
          that.checkInvite();
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
  checkInvite() {
    let hyz_userinfo = app.getHyzUserInfo();
    console.log("邀请函 inviteId", this.data.inviteId);
    app.wechat.fetchAPI('GET', app.api.COMMON_API.visitor.VISITOR + "/" + this.data.inviteId).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            invitation: res.data.hyz_result
          });
          this.setInvitor();
          this.getQrCodeText();
        }
      }
    })
  },
  setInvitor() {
    let visitorTime = this.data.invitation.visitorStartTime.split(" ")[0];
    let visitorStartTime = this.data.invitation.visitorStartTime.split(" ")[1];
    let visitorEndTime = this.data.invitation.visitorEndTime.split(" ")[1];
    this.setData({
      visitorTime: visitorTime,
      visitorStartTime: visitorStartTime,
      visitorEndTime: visitorEndTime
    })

    app.wechat.fetchAPI('GET', app.api.COMMON_API.common.USER_INFO + this.data.invitation.inviterId).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            invitor: res.data.hyz_result
          })
          if (res.data.hyz_result.rootOrganization) {
            this.setData({
              company: res.data.hyz_result.rootOrganization.organizationName
            })
          }
        }
      }
    })
  },
  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  backToHome() {
    wx.redirectTo({
      url: "../../welcome/welcome?aaa=123",
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
})