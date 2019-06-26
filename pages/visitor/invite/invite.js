// pages/home/visitor/invite.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitorname: "",
    visitorphone: "",
    visitDate: "",
    visitorStartTime: "09:00",
    visitorEndTime: "18:00",
    showChoose: false,
    inviteTypes: [{
        name: '电话通知被邀请人',
        // icon: 'mobilephone'
      },
      {
        name: '发送给微信好友',
        icon: 'share',
        openType: 'share'
      }
    ],
    hidInviteLetter: true,
    invitation: null,
    inviteId: 0,
    errorTimes:""
  },
  backToHome() {
    wx.redirectTo({
      url: "../../welcome/welcome?from=invite",
      success: function(res) {
        console.log("跳转成功:" + JSON.stringify(res));
      }
    });
  },
  checkInvite(e) {
    let formId = e.detail.formId;
    let formvalue = e.detail.value;
    console.log("formvalue", formvalue);

    if (!formvalue.vname) {
      $Toast({
        content: '请输入被邀请人',
        type: 'warning'
      });
      return;
    }
    if (!formvalue.vphone) {
      $Toast({
        content: '请输入预约手机号',
        type: 'warning'
      });
      return;
    }
    if (!this.data.visitDate) {
      $Toast({
        content: '请选择到访日期',
        type: 'warning'
      });
      return;
    }

    this.setData({
      visitorname: formvalue.vname,
      visitorphone: formvalue.vphone,
      invitation: {
        visitorName: formvalue.vname,
        telphone: formvalue.vphone,
        visitorStartTime: this.data.visitDate + " " + this.data.visitorStartTime + ":00",
        visitorEndTime: this.data.visitDate + " " + this.data.visitorEndTime + ":00",
      }
    });
    let datestr = this.data.visitDate.replace(/-/g,"");
    app.wechat.fetchAPI('GET', app.api.COMMON_API.visitor.GET_VISITTIME + this.data.visitorphone + "/" + datestr).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result.length > 0) {
          let isOk = true;
          let errorTimes = [];
          let thisStart = new Date(this.data.invitation.visitorStartTime);
          let thisEnd = new Date(this.data.invitation.visitorEndTime);
          for (var range of res.data.hyz_result){
            let rangetime = range.split("-");
            let rangeStart = new Date(this.data.visitDate + " " + rangetime[0].substr(0, 2) + ":" + rangetime[0].substr(2, 2) + ":" + rangetime[0].substr(4, 2));
            let rangeEnd = new Date(this.data.visitDate + " " + rangetime[1].substr(0, 2) + ":" + rangetime[1].substr(2, 2) + ":" + rangetime[1].substr(4, 2));
            // console.log("rangetime", rangetime);
            // console.log("rangeStart", rangeStart);
            // console.log("rangeEnd", rangeEnd);
            errorTimes.push(rangetime[0].substr(0, 2) + ":" + rangetime[0].substr(2, 2) + ":" + rangetime[0].substr(4, 2) + "~" + rangetime[1].substr(0, 2) + ":" + rangetime[1].substr(2, 2) + ":" + rangetime[1].substr(4, 2));
            if (rangeStart > thisStart){
              isOk = isOk && (rangeStart > thisEnd)
            } else {
              isOk = isOk && (thisStart > rangeEnd)
            }
          }
          if (isOk) {
            this.newInvite();
            this.setData({
              errorTimes: ""
            })
          }else{
            this.setData({
              errorTimes: errorTimes.join("\n")
            })
          }
        }else{
          this.newInvite();
        }
      }
    });
  },
  newInvite() {
    console.log("this.data.invitation", JSON.stringify(this.data.invitation));
    app.wechat.fetchAPI('POST', app.api.COMMON_API.visitor.VISITOR, this.data.invitation).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            errorTimes: "",
            inviteId: res.data.hyz_result.id,
            hidInviteLetter: false
          });
        }
      }
    });
  },
  showChoose() {
    this.setData({
      showChoose: true,
      hidInviteLetter: true
    })
  },
  chooseInvite({
    detail
  }) {
    const index = detail.index;

    if (index === 0) {
      wx.makePhoneCall({
        phoneNumber: this.data.invitation.telphone
      })
    } else if (index === 1) {
      console.log("发送给微信好友");

      // var params = {};
      // app.wechat.fetchAPI('POST', app.api.COMMON_API.visitor.VISITOR, params).then(res => {
      //   if (res.data.hyz_code === 20000) {
      //     $Toast({
      //       content: '领取会员卡成功',
      //       type: 'success'
      //     });
      //     this.setData({
      //       isActive: true
      //     })
      //   }
      // });
    }

    this.setData({
      showChoose: false
    });
  },
  cancelInvite() {
    this.setData({
      showChoose: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let name = options.name;
    let telephone = options.telephone;
    if (name) {
      this.setData({
        visitorname: name
      })
    }
    if (telephone) {
      this.setData({
        visitorphone: telephone
      })
    }
  },
  phoneChange(e) {
    this.setData({
      visitorphone: e.detail.detail.value
    })
    // console.log("this.data.visitorphone", this.data.visitorphone);
  },
  bindDateChange: function (e) {
    this.setData({
      visitDate: e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({
      visitorStartTime: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      visitorEndTime: e.detail.value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    console.log('goInvite::' + this.data.inviteId)
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log('来自页面内转发按钮');
      console.log("ops",ops)
      return {
        title: '您收到来自 天德广场 的邀请',
        desc: '点击领卡',
        imageUrl: "/image/liede.png", 
        // path: 'pages/visitor/invitation/invitation?inviteId=37209',
        path: 'pages/visitor/invitation/invitation?inviteId=' + this.data.inviteId,
        success: function(res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function(res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        },
        complete: function(res) {
          // 转发失败
          console.log("转发complete:" + JSON.stringify(res));
          wx.navigateBack({
            delta: 1
          })
        }
      }
    }
  }
})