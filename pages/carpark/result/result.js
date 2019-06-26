// pages/carpark/payfee/payfee.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCurrent: "pay",
    recordInfo: null,
    carInfo: null,
    // carInfo:{
    //   licensePlateNumber:"京HY0978",
    //   vehiclePicture:"../../../image/car.jpg",
    //   maybe: [{
    //     "licensePlateNumber": "京HY0978",
    //     "vehiclePicture": "../../../image/car.jpg"
    //   }, {
    //     "licensePlateNumber": "京HY0978",
    //     "vehiclePicture": "../../../image/car.jpg"
    //   }]
    // },
    payment: null,
    orderInfo: null,
    invitation: null,
    carStatus: 1, // carStatus:车辆牌照状态，1是无牌，2是有牌
    spinShow: true,
    loading: false,
    errorMsg: "",
    showWuye: false,
    appWuyeTel: app.globalData.appWuyeTel,
    wuyeActions: [{
        name: '取消'
      },
      {
        name: '拨打物业电话',
        color: '#ed3f14'
      }
    ],
    interval: null,
    parkGate: "",
    intime: "",
    outtime: "",
    carnum: "",
    price: 0,
    discont: 0,
    discontcut: 0,
    coupon: 0,
    final: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.startPullDownRefresh();
  },
  onPullDownRefresh: function () {
    if (this.data.parkGate || this.data.carnum) {
      var that = this;
      var interval = setInterval(function () {
        let hyz_userinfo = app.getHyzUserInfo();
        if (hyz_userinfo) {
          clearInterval(that.data.interval);
          that.checkFee();
          that.searchCar();
          that.stopPullDownRefresh();
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
  stopPullDownRefresh: function () {
    let _this = this;
    wx.stopPullDownRefresh({
      complete: function (res) {
        // _this.setData({
        //   loadmoreLoading: false
        // });
        // $Toast.hide();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("payfee options:", options);
    let gate = options.gate;
    let carnum = options.carnum;
    // carnum = "京AA12347";
    // 扫码
    let q = options.q;
    if (q) {
      let url = decodeURIComponent(q);
      let urlarr = url.split('/');

      gate = urlarr[urlarr.length - 1];
    }

    if (gate || carnum) {
      // 如果是线上支付停车费
      if (carnum) {
        this.setData({
          carnum: carnum
        })
      }
      if (gate) {
        this.setData({
          parkGate: gate
        })
      }
    }
  },
  formSubmit: function(e) {
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type;
    console.log("formSubmit----------------" + type);
    app.dealFormIds(formId);
    switch (type) {
      case "zhaoche":
        // this.doScan();
        break;
      case "kefu":
        // this.goErweima();
        break;
    }
  },
  // 查询当前闸机前车牌
  checkFee() {
    let url = "";
    if (this.data.carnum) {
      url = app.api.COMMON_API.parkinglot.GETMY_BYNUM + this.data.carnum;
    } else if (this.data.parkGate) {
      // url = app.api.COMMON_API.parkinglot.GETMY_NONUM;
      url = app.api.COMMON_API.parkinglot.GETMY_BYGATE + this.data.parkGate;
    }
    if (url) {
      app.wechat.fetchAPI('GET', url).then(res => {
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            let payment = res.data.hyz_result.payment;
            if (payment) {
              // payment.parkingTimeStr = payment.parkingTime/1000
              let parkingTimeStr = "";

              let day = parseInt(payment.parkingTime / (24 * 60 * 60 * 1000));
              let hour = parseInt(payment.parkingTime / (60 * 60 * 1000));
              let minite = parseInt(payment.parkingTime / (60 * 1000));
              minite = minite - hour * 60;
              hour = hour - day * 24;
              if (day) {
                parkingTimeStr = parkingTimeStr + day + "天";
              }
              if (hour) {
                parkingTimeStr = parkingTimeStr + hour + "小时";
              }
              if (minite) {
                parkingTimeStr = parkingTimeStr + minite + "分钟";
              }
              payment.parkingTimeStr = parkingTimeStr;
            }
            this.setData({
              recordInfo: res.data.hyz_result,
              payment: res.data.hyz_result.payment,
              outtime: app.appUtil.formatTime(new Date())
            })
          }
          // else{
          //   this.checkFeeNonum();
          // }
        } else {
          if (this.data.parkGate) {
            this.checkFeeNonum();
          }
        }
        this.setData({
          spinShow: false
        })
        // }).then(res => {

      });
    } else {
      this.setData({
        spinShow: false
      })
    }
  },
  // 查询当前用户无牌车
  checkFeeNonum() {
    let url = app.api.COMMON_API.parkinglot.GETMY_NONUM;
    app.wechat.fetchAPI('GET', url).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let payment = res.data.hyz_result.payment;
          if (payment) {
            // payment.parkingTimeStr = payment.parkingTime/1000
            let parkingTimeStr = "";

            let day = parseInt(payment.parkingTime / (24 * 60 * 60 * 1000));
            let hour = parseInt(payment.parkingTime / (60 * 60 * 1000));
            let minite = parseInt(payment.parkingTime / (60 * 1000));
            minite = minite - hour * 60;
            hour = hour - day * 24;
            if (day) {
              parkingTimeStr = parkingTimeStr + day + "天";
            }
            if (hour) {
              parkingTimeStr = parkingTimeStr + hour + "小时";
            }
            if (minite) {
              parkingTimeStr = parkingTimeStr + minite + "分钟";
            }
            payment.parkingTimeStr = parkingTimeStr;
          }
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
    });
  },
  pickTicket() {
    let coupon = "";
    if (this.data.payment.coupon) {
      coupon = "&coupon=" + this.data.payment.coupon;
    }
    app.wechat.navigatorTo('../../card/pickTicket/pickTicket?paymentId=' + this.data.payment.id + coupon);
  },
  confirmCarnum(e) {
    let formId = e.detail.formId;
    app.dealFormIds(formId);
    this.setData({
      loading: true
    })
    this.addOrder();
  },
  addOrder() {
    this.setData({
      spinShow: true
    })
    let hyz_userinfo = app.getHyzUserInfo();
    let params = {
      "accountantSubjects": "停车收费",
      "detailSubjects": "停车收费",
      "financialObjectType": "停车收费",
      "businessId": this.data.recordInfo.id, // 停车记录id
      "money": this.data.payment.amount,
      "payMoney": this.data.payment.notPayedAmount,
      "payUserId": hyz_userinfo.id,
      "payUserName": hyz_userinfo.userName,
      "paymentType": 1,
      "systemKey": "ParkingSystem"
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.ORDER, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            orderInfo: res.data.hyz_result
          })
          this.apppay();
        }
      }
    })
  },
  apppay() {
    let params = {
      "orderId": this.data.orderInfo.id,
      "payAction": 1,
      "payType": 2,
      "totalAmount": this.data.orderInfo.payMoney
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.APPPAY, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // $Toast({
          //   content: '操作成功',
          //   type: 'success'
          // });
          this.wechatPay(res.data.hyz_result);
        }
      }
    })
  },
  wechatPay(signmap) {
    // 'timeStamp': '',
    //   'nonceStr': '',
    //     'package': '',
    //       'signType': 'MD5',
    //         'paySign': '',
    let that = this;
    // this.setData({
    //   spinShow: false
    // })
    that.payResult();
    // // 需要开通支付功能
    // wx.requestPayment({
    //   timeStamp: signmap.timeStamp,
    //   nonceStr: signmap.nonceStr,
    //   package: signmap.package,
    //   signType: signmap.signType,
    //   paySign: signmap.paySign,
    //   success(res) {
    //     console.log("调起微信支付成功", res)
    //     that.payResult();
    //   },
    //   fail(res) {
    //     console.log("调起微信支付失败",res)
    //   }
    // })
  },
  payResult() {
    let params = {
      "orderId": this.data.orderInfo.id,
      "payAction": 1,
      "payType": 2,
      "totalAmount": this.data.orderInfo.payMoney
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.APPPAY_RESULT, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          $Toast({
            content: '支付成功',
            type: 'success'
          });
          this.recordPayed(res.data.hyz_result);
        } else {
          $Toast({
            content: '支付失败',
            type: 'error'
          });
        }
      } else {
        $Toast({
          content: res.data.hyz_message,
          type: 'error'
        });
      }
    })
  },
  recordPayed() {
    let params = {
      "parkingRecordId": this.data.recordInfo.id
    };
    if (this.data.parkGate) {
      params.gateId = this.data.parkGate;
    }

    app.wechat.fetchAPI('POST', app.api.COMMON_API.parkinglot.RECORD_PAYED, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let errorMsg = "";
          //carStatus (string, optional): 车辆状态 0-已出场 1-在场内 ,
          // 如果开闸成功 carStaus 为出场，反之失败
          if (res.data.hyz_result.carStatus === "0") {
            this.backToHome();
          } else {
            if (this.data.parkGate) {
              errorMsg = "开闸失败，请再次尝试或者求助物业"
              $Toast({
                content: '开闸失败',
                type: 'error'
              });
            } else {
              // 不在闸机前
            }
          }
          this.setData({
            loading: false,
            spinShow: false,
            recordInfo: res.data.hyz_result,
            payment: res.data.hyz_result.payment,
            errorMsg: errorMsg
          })
        }
      } else {
        $Toast({
          content: res.data.hyz_message,
          type: 'error'
        });
      }
    })
  },
  zhaoche() {
    let getestr = "";
    if (this.data.parkGate) {
      getestr = "&gate=" + this.data.parkGate;
    }
    app.wechat.navigatorTo('../handSearch/handSearch?from=payfee' + getestr);
  },
  callwuye() {
    this.setData({
      showWuye: true
    })
  },
  handleCallWuye({
    detail
  }) {
    const index = detail.index;

    if (index === 1) {
      wx.makePhoneCall({
        phoneNumber: this.data.invitation.telphone
      })
    }

    this.setData({
      showWuye: false
    });
  },
  searchCar() {
    if (this.data.carnum) {
      let carrr = this.data.carnum;
      // carrr = "京K59290"; //京HY0978 ,京K59290
      app.wechat.fetchAPI('GET', app.api.COMMON_API.car.FIND_CAR + carrr).then(res => {
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            // res.data.hyz_result.licensePlateNumber = "京HY0978";
            // res.data.hyz_result.vehiclePicture = "../../../image/car.jpg";
            // res.data.hyz_result.maybe = [{
            //   "licensePlateNumber": "京HY0978",
            //   "vehiclePicture": res.data.hyz_result.vehiclePicture
            // }, {
            //   "licensePlateNumber": "京HY0978",
            //     "vehiclePicture": "../../../image/car.jpg"
            // }, {
            //   "licensePlateNumber": "京HY0978",
            //     "vehiclePicture": "../../../image/car.jpg"
            // }];
            if (res.data.hyz_result.licensePlateNumber) {
              this.setData({
                carInfo: res.data.hyz_result
              })
            }
          } else {
            $Toast({
              content: '未查到车牌号',
              type: 'warning'
            });
          }
        }
      });
    }
  },
  tapMain() {
    console.log("this.data.carInfo.licensePlateNumber", this.data.carInfo.licensePlateNumber);
    this.gotoPosition(this.data.carInfo.licensePlateNumber);
  },
  tapMaybe(event) {
    let bindex = event.currentTarget.dataset.bindex;
    let item = event.currentTarget.dataset.item;
    this.gotoPosition(item.licensePlateNumber);
  },
  gotoPosition(carnum) {
    console.log('../position/position?carnum=' + carnum);
    app.wechat.navigatorTo('../position/position?carnum=' + carnum);
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
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  switchCheckWay({
    detail
  }) {
    this.setData({
      tabCurrent: detail.key
    });
  },
})