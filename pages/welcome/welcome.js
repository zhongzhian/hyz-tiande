// pages/welcome/welcome.js
//获取应用实例
const app = getApp()
const {
  $Toast
} = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '欢迎进入天德广场',
    isHuiyuan: false,
    isVisitor: false,
    isActive: false,
    isLoser: false,
    showModal: false,
    swiperCurrent: 0,
    interval: null,
    // userBtns:[],
    swipeDot: false,
    swipertitle: "",
    swipeDatas: {
      "carpark": {
        title: "车位引导",
        imageUrl: "../../image/carpark.png",
        imageWidth: 0,
        imageHeight: 0
      }
    },
  },
  formSubmit: function(e) {
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type;
    console.log("formSubmit----------------" + type);
    app.dealFormIds(formId);
    switch (type) {
      case "doScan":
        this.doScan();
        break;
      case "goErweima":
        this.goErweima();
        break;
      case "goVisitor":
        this.goVisitor();
        break;
      case "goPayfee":
        this.goPayfee();
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let from = options.from;
    // console.log("from",from)

    // var that = this;
    // var interval = setInterval(function() {
    //   let hyz_userinfo = app.getHyzUserInfo();
    //   if (hyz_userinfo) {
    //     clearInterval(that.data.interval);
    //     that.setUserConfig();
    //   }
    // }, 100)

    // that.setData({
    //   interval: interval
    // })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var interval = setInterval(function() {
      let hyz_token = wx.getStorageSync(app.hyzconst.AJAX_TOKEN);
      if (hyz_token) {
        clearInterval(that.data.interval);
        app.wechat.fetchAPI('GET', app.api.COMMON_API.common.USER_CURRENT).then(res => {
          if (res.data.hyz_code === 20000) {
            app.setHyzUserInfo(res.data.hyz_result);
            that.setUserConfig();
          }
        })
      }
    }, 100)

    that.setData({
      interval: interval
    })

  },
  setUserConfig() {
    // userType(integer, optional): 用户类型 1：admin，2：物业管理admin，3：公司admin，
    // 4：物业管理账户，5：公司管理账户， 6：物业员工账户，7：公司员工账户，8：临时访客账户，9：路人账户
    let hyz_userinfo = app.getHyzUserInfo();
    let _swipeDatas = this.data.swipeDatas;
    let _swipeDot = false,
      _isHuiyuan = false,
      _isVisitor = false,
      _isLoser = false;
    // 访客
    if (hyz_userinfo.userType === 8) {
      _isVisitor = true;
      _isHuiyuan = true;
    } else {
      // 有卡代表不是路人
      // cardStatus：卡状态，0 - 未领取，1：在用，2：停用，3：过期,
      if (hyz_userinfo.cardVo) {
        if (!_swipeDatas["viphome"]) {
          _swipeDatas["viphome"] = {
            title: "会员中心",
            imageUrl: "../../image/vip.jpg",
            imageWidth: 0,
            imageHeight: 0
          }
        }
        _swipeDot = true;
        _isHuiyuan = true;

        // 有卡，但是未激活
        if (hyz_userinfo.cardVo.cardStatus === 0) {
          this.setData({
            showModal: true
          })
        } else if (hyz_userinfo.cardVo.cardStatus === 1) {
          this.setData({
            isActive: true
          })
        }

        this.setData({
          swipeDatas: _swipeDatas
        })
      } else {
        _isLoser = true;
        // 路人
        this.setData({
          isLoser: _isLoser
        })
      }
    }

    this.setData({
      isHuiyuan: _isHuiyuan,
      isVisitor: _isVisitor,
      swipeDot: _swipeDot,
      swipertitle: "车位引导"
    })
  },
  imageTap: function(e) {
    let key = e.currentTarget.id;
    switch (key) {
      case "carpark":
        this.searchCar();
        break;
      case "viphome":
        this.goHuiyuan();
        break;
    }
  },
  getApiTicket() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.common.API_TICKET + "/1").then(res => {
      if (res.data.hyz_code === 20000) {
        let hyz_userinfo = app.getHyzUserInfo();
        this.addCard(hyz_userinfo.cardVo.cardTypeVo.cardKey, res.data.hyz_result);
      }
    });
  },
  addCard(card_id, api_ticket) {
    let that = this;
    var timestampStr = parseInt(new Date().getTime() / 1000) + '',
      // var timestampStr = '1555503943',
      // card_id = 'plqmg1dDBhbIpZR9nTuWi7vART8Q',
      // api_ticket = '9KwiourQPRN3vx3Nn1c_iT9XFMmcOsnIohwM65r8-opfh1DJ5ZdCL1PN9Z9wMmL7tVzA8UE-eZW-Ipurn5K-Yg',
      nonce_Str = 'TianDe' + timestampStr;
    var arr = [api_ticket, timestampStr, nonce_Str, card_id]
    arr = arr.sort();
    var str = '';
    for (var i = 0; i < arr.length; i++) {
      str += arr[i];
    }
    // console.log(arr);
    // str = "VUkHJgW2SFNG4xhs6ZntSP-P6TL0-PzyE_OBOAI8zqEhZyj_f4adlfPwrfi31yM2eNYJpGWg0lmKuJY0OUIFeg1555503943Zhong1555503943plqmg1dDBhbIpZR9nTuWi7vART8Q";

    // console.log("str", str);
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
              that.setData({
                isActive: true
              })
              //card.code card.cardId
              app.wechat.fetchAPI('GET', app.api.COMMON_API.card.CURRENT_USER_CARD).then(res => {
                if (res.data.hyz_code === 20000) {
                  if (res.data.hyz_result) {
                    //cardCode就是领卡返回的code，weixinCode就是微信卡类型ID
                    res.data.hyz_result.weixinCode = card.cardId;
                    res.data.hyz_result.cardCode = card.code;
                    res.data.hyz_result.cardStatus = 1;
                    app.wechat.fetchAPI('PUT', app.api.COMMON_API.card.USER_CARD, res.data.hyz_result).then(res => {
                      if (res.data.hyz_code === 20000) {
                        $Toast({
                          content: '领取会员卡成功',
                          type: 'success'
                        });
                      }
                    });
                  }
                }
              });

              // 正常情况肯定只有一张卡
              // 更新用户信息
              app.wechat.fetchAPI('GET', app.api.COMMON_API.common.USER_CURRENT).then(res => {
                if (res.data.hyz_code === 20000) {
                  app.setHyzUserInfo(res.data.hyz_result);
                  console.log("--------------- welcome 领卡成功 更新用户信息 ---------------");
                  console.log("hyz_userinfo", res.data.hyz_result);
                }
              });
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
  okModal() {
    this.getApiTicket();
    this.setData({
      showModal: false
    })
  },
  cancelModal() {
    this.setData({
      showModal: false
    })
  },
  goHuiyuan() {
    if (this.data.isActive) {
      app.wechat.navigatorTo('../index/index');
    } else {
      this.setData({
        showModal: true
      })
    }
  },
  goErweima() {
    app.wechat.navigatorTo('../feature/erweima/erweima');
    // if (this.data.isActive) {
    //   app.wechat.navigatorTo('../feature/erweima/erweima');
    // } else {
    //   this.setData({
    //     showModal: true
    //   })
    // }
  },
  goPayfee() {
    app.wechat.navigatorTo('../carpark/handSearch/handSearch');
  },
  goVisitor() {
    app.wechat.navigatorTo('../mine/invitation/invitation');
  },
  swiperChange: function(e) {
    let count = 0,
      title = "";
    for (var d in this.data.swipeDatas) {
      if (e.detail.current === count) {
        title = this.data.swipeDatas[d].title;
        break;
      }
      count++;
    }
    this.setData({
      swiperCurrent: e.detail.current,
      swipertitle: title
    })
  },
  //轮播图点击事件
  swipclick: function(e) {
    console.log(this.data.swiperCurrent)
  },
  // 取车
  searchCar() {
    app.wechat.navigatorTo('../carpark/search/search');
  },
  // 无牌车
  doScan() {
    // $Toast({
    //   content: '解析中',
    //   type: 'loading'
    // });
    app.wechat.scanCode().then(res => {
      console.log(res);
      let result = res.result;
      if (result) {
        // let url = decodeURIComponent(result);
        // let urlarr = url.split('/');
        // console.log("urlarr", urlarr);
        // app.wechat.navigatorTo('../carpark/nonum/nonum?gate=' + urlarr[urlarr.length - 1]);
        $Toast({
          content: '解析中',
          type: 'loading'
        });
        setTimeout(() => {
          app.handleQrcode(result);
        }, 500);
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  imageLoad: function(e) {
    let imageSize = app.appUtil.imageUtil(e);
    let key = e.currentTarget.id;
    let _swipeDatas = this.data.swipeDatas;
    _swipeDatas[key].imageWidth = imageSize.imageWidth;
    _swipeDatas[key].imageHeight = imageSize.imageHeight;
    let datakey = "swipeDatas." + key;
    this.setData({
      [datakey]: _swipeDatas[key]
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  }
})