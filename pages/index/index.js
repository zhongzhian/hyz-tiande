//index.js
//获取应用实例
const app = getApp()
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    motto: 'Hello World',
    ticket: '',
    accesstoken: '',
    userInfo: {},
    hasUserInfo: false,
    telphone: "",
    userCompany: "",
    userDept: "",
    interval: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    myList: [{
      key: "wodeqiche",
      icon: "../../image/wodeqiche.png",
      label: "我的车牌"
    }, {
      key: "wodechewei",
      icon: "../../image/wodechewei.png",
      label: "我的车位"
    }, {
      key: "wodefangke",
      icon: "../../image/wodefangke.png",
      label: "我的访客"
    }, {
      key: "wodepiaoquan",
      icon: "../../image/wodepiaoquan.png",
      label: "我的票券"
    }],

    // 票券
    recordList: [{
      key: "jiaofeijilu",
      icon: "../../image/jiaofei.png",
      label: "缴费记录"
    }, {
      key: "fapiao",
      icon: "../../image/fapiao.png",
      label: "发票"
    }, {
      key: "fangke",
      icon: "../../image/fangkejilu.png",
      label: "访客记录"
    }, {
      key: "tingche",
      icon: "../../image/tingchejilu.png",
      label: "停车记录"
    }, {
      key: "gonggaolishi",
      icon: "../../image/gonggaolishi.png",
      label: "历史公告"
    }, {
      key: "wodebaoxiu",
      icon: "../../image/baoxiujilu.png",
      label: "我的报修"
    }, {
      key: "wodetousu",
      icon: "../../image/tousujianyi.png",
      label: "我的投诉"
    }],

    // 物业
    wuyeList: [{
      key: "shebeibaoxiu",
      icon: "../../image/shebeibaoxiu.png",
      label: "报修"
    }, {
      key: "lianxikefu",
      icon: "../../image/kefu.png",
      label: "客服"
    }, {
      key: "faqitousu",
      icon: "../../image/faqitousu.png",
      label: "投诉建议"
    // }, {
    //   key: "menjinchushihua",
    //   icon: "../../image/menjinchushihua.png",
    //   label: "门禁初始化"
    }],

    // 功能
    toolsList: [{
      key: "yaoqingfangke",
      icon: "../../image/yaoqingfangke.png",
      label: "邀请访客"
    }, {
      key: "jiaofei",
      icon: "../../image/woyaojiaofei.png",
      label: "缴费"
    }, {
      key: "xunche",
      icon: "../../image/xunchejiaofei.png",
      label: "智能停车"
    }, {
      key: "saoma",
      icon: "../../image/saoma.png",
      label: "扫码"
    }, {
      key: "menjin",
      icon: "../../image/menjinerweima.png",
      label: "门禁二维码"
    }, {
      key: "fafangpiaoquan",
      icon: "../../image/bigpiaoquan.png",
      label: "发放票券"
    }, {
      key: "qiantaifangxing",
      icon: "../../image/bigqiantai.png",
      label: "前台放行"
      }, {
        key: "menjininit",
        icon: "../../image/bigchushihua.png",
        label: "门禁初始化"
    }]
  },
  onLoad: function () {
    // this.addCard();
    // this.addTicket();

    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        console.log("res", res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        } else {
          // console.log("scope.userInfo....");
          wx.authorize({
            scope: "scope.userInfo",
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo({
                success: res => {
                  app.globalData.userInfo = res.userInfo
                  that.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                  })
                }
              })
            }
          })
        }
      }
    })

    // if (app.globalData.userInfo) {
    //   console.log("app.globalData.userInfo", app.globalData.userInfo);
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   console.log("this.data.canIUse", this.data.canIUse);
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   console.log("wx.getUserInfo");
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

    var interval = setInterval(function () {
      let hyz_userinfo = app.getHyzUserInfo();
      if (hyz_userinfo) {
        clearInterval(that.data.interval);
        //TODO 判断角色，卡等
        // userType(integer, optional): 用户类型 1：admin，2：物业管理admin，3：公司admin，
        // 4：物业管理账户，5：公司管理账户， 6：物业员工账户，7：公司员工账户，8：临时访客账户，9：路人账户
        let toolsList = that.data.toolsList;
        if (hyz_userinfo.userType < 8) {
          toolsList.push({
            key: "gonggao",
            icon: "../../image/fabugonggao.png",
            label: "发布公告"
          });
        }
        that.setData({
          toolsList: toolsList,
          telphone: hyz_userinfo.telphone,
          userDept: hyz_userinfo.organizationName,
          userCompany: app.getHyzUserCompany()
        })
      }
    }, 100)

    that.setData({
      interval: interval
    })

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  userinfo() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.common.USER_CURRENT).then(res => {
      if (res.data.hyz_code === 20000) {
        app.setHyzUserInfo(res.data.hyz_result);
      }
    });
  },

  formSubmit: function(e) {
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type;
    console.log("formSubmit----------------" + type);
    app.dealFormIds(formId);
    this.gotoPage(type);
  },
  // gotoPage(e) {
  gotoPage(key) {
    // let key = e.currentTarget.id;
    // console.log("key", key);
    let url = "";
    switch (key) {
      // 我的
      case "wodeqiche":
        url = "../mine/cars/cars";
        break;
      case "wodechewei":
        url = "../mine/carplaces/carplaces";
        break;
      case "wodefangke":
        url = "../mine/visitor/visitor";
        break;
      case "wodepiaoquan":
        url = "../mine/mytickets/mytickets";
        break;

        // 会员功能
      case "yaoqingfangke":
        url = "../visitor/invite/invite";
        break;
      case "jiaofei":
        url = "../payment/list/list";
        break;
      case "menjin":
        url = "../feature/erweima/erweima";
        break;
      case "xunche":
        url = "../carpark/search/search";
        break;
      case "saoma":
        url = "";
        this.doScan();
        break;
      case "gonggao":
        url = "../notice/emit/emit";
        break;
      case "fafangpiaoquan":
        url = "../card/ticketTypeList/ticketTypeList";
        break;
      case "qiantaifangxing":
        url = "../feature/inviteList/inviteList";
        break;
      case "menjininit":
        url = "../feature/initGate/initGate";
        break;

        // 记录单据
      case "jiaofeijilu":
        url = "../payment/record/record";
        break;
      case "fapiao":
        url = "../payment/invoice/invoice";
        break;
      case "fangke":
        url = "../visitor/myvisitor/myvisitor";
        break;
      case "tingche":
        url = "../carpark/record/record";
        break;
      case "gonggaolishi":
        url = "../notice/list/list";
        break;
      case "wodebaoxiu":
        url = "";
        break;
      case "wodetousu":
        url = "";
        break;

        // 物业
      case "shebeibaoxiu":
        url = "";
        break;
      case "lianxikefu":
        url = "";
        break;
      case "faqitousu":
        url = "";
        break;
      case "menjinchushihua":
        url = "../feature/initGate/initGate";
        break;
    }
    if (url) {
      app.wechat.navigatorTo(url);
    }
  },
  // 无牌车
  doScan() {
    app.wechat.scanCode().then(res => {
      console.log(res);
      let result = res.result;
      if (result) {
        $Toast({
          content: '解析中',
          type: 'loading'
        });
        setTimeout(() => {
          app.handleQrcode(result);
        }, 500);
        // app.handleQrcode(result);
      }
    })
  },
  addTicket() {
    var aaa = {
      "card": {
        "card_type": "GENERAL_COUPON",
        "general_coupon": {
          "base_info": {
            "logo_url": "https://mmbiz.qlogo.cn/mmbiz_png/zx7mYOy8MVLup6bib113kgaCbwdq73yub3meo9H2lotok9QKvNkIIHnlxq0wmEUiczibgCQDKxFeWTVWRwPPPP1iaw/0?wx_fmt=png",
            "brand_name": "天德广场",
            "code_type": "CODE_TYPE_NONE",
            "title": "2小时停车券",
            "color": "Color010",
            "notice": "小程序支付车费时扣减",
            "service_phone": "020-88888888",
            "description": "不可与其他优惠同享",
            "date_info": {
              "type": "DATE_TYPE_FIX_TERM",
              "fixed_term": 7,
              "fixed_begin_term": 0
            },
            "sku": {
              "quantity": 100000000
            },
            "get_limit": 1,
            "use_limit": 10000,
            "use_custom_code": false,
            "bind_openid": false,
            "can_share": false,
            "can_give_friend": false,
            "center_title": "立即使用",
            "center_sub_title": "进入小程序支付车费抵扣",
            "center_url": "www.qq.com",
            "center_app_brand_user_name": "gh_9ba2dd3f4330@app",
            "center_app_brand_pass": "pages/card/ticket/ticket?type=2",
            "custom_url_name": "我的票券",
            "custom_url": "http://www.qq.com",
            "custom_app_brand_user_name": "gh_9ba2dd3f4330@app",
            "custom_app_brand_pass": "pages/card/mine/ticket",
            "custom_url_sub_title": "进入小程序"

          },
          "default_detail": "此券为天德广场停车场停车时长抵扣券，需通过小程序支付车费时使用。"
        }
      }
    }
    var ssss = {
      "couponName": "2小时停车抵扣券",
      "description": "此券为天德广场停车场停车时长抵扣券，需要通过小程序支付车费才使用。",
      "duration": 2,
      "type": "1",
      "typeName": "限时",
      "validPeriod": 7,
      "wechatParam": JSON.stringify(aaa)
    }

    // 修改
    // var aaa = {
    //   "card_id": "plqmg1ZUN3K5iwmDn97XwSETA_Xo",
    //   "general_coupon": {
    //     "base_info": {
    //       "center_title": "立即使用",
    //       "center_sub_title": "进入小程序支付车费抵扣",
    //       "center_url": "www.qq.com",
    //       "center_app_brand_user_name": "gh_9ba2dd3f4330@app",
    //       "center_app_brand_pass": "pages/card/ticket/ticket?type=2"
    //     }
    //   }
    // }
    // var ssss = {
    //   "couponKey": "plqmg1ZUN3K5iwmDn97XwSETA_Xo",
    //   "couponName": "5小时停车抵扣券",
    //   "description": "",
    //   "duration": 5,
    //   "validPeriod": 7,
    //   "wechatParam": JSON.stringify(aaa)
    // }
    console.log(JSON.stringify(ssss));
  },
  addCard() {
    // "background_pic_url": "https://mmbiz.qlogo.cn/mmbiz_jpg/zx7mYOy8MVL34U4psvmcL3n6I8HTEaTrNfE4hgWYGWmTasyiboY5BqzQk1LRyAlSYjbev4qmwfAHKr78D6pzg8g/0?wx_fmt=jpeg",
    var aaa = {
      "card": {
        "card_type": "MEMBER_CARD",
        "member_card": {
          "background_pic_url": "https://mmbiz.qlogo.cn/mmbiz_jpg/zx7mYOy8MVL34U4psvmcL3n6I8HTEaTrNfE4hgWYGWmTasyiboY5BqzQk1LRyAlSYjbev4qmwfAHKr78D6pzg8g/0?wx_fmt=jpeg",
          "base_info": {
            "logo_url": "https://mmbiz.qlogo.cn/mmbiz_png/zx7mYOy8MVLup6bib113kgaCbwdq73yub3meo9H2lotok9QKvNkIIHnlxq0wmEUiczibgCQDKxFeWTVWRwPPPP1iaw/0?wx_fmt=png",
            "brand_name": "天德广场",
            "code_type": "CODE_TYPE_NONE",
            "title": "公司员工卡",
            "color": "Color030",
            "notice": "使用时出示二维码",
            "service_phone": "020-88888888",
            "description": "不可与其他优惠同享",
            "date_info": {
              "type": "DATE_TYPE_PERMANENT"
            },
            "sku": {
              "quantity": 100000000
            },
            "get_limit": 1,
            "use_custom_code": false,
            "can_give_friend": false,
            "can_share": false,
            "center_title": "进入天德",
            "center_url": "http://www.qq.com",
            "center_sub_title": "出示门禁二维码扫码进入",
            "center_app_brand_user_name": "gh_9ba2dd3f4330@app",
            "center_app_brand_pass": "pages/feature/erweima/erweima",
            "custom_url_name": "智能寻车",
            "custom_url": "http://www.qq.com",
            "custom_app_brand_user_name": "gh_9ba2dd3f4330@app",
            "custom_app_brand_pass": "pages/carpark/search/search",
            "custom_url_sub_title": "小程序"
          },
          "supply_bonus": false,
          "supply_balance": false,
          "prerogative": "该会员卡可以自由进出天德大厦",
          "auto_activate": true
        }
      }
    }
    var ssss = {
      "cardClass": "MEMBER_CARD",
      "cardName": "公司员工卡",
      "cardType": 4,
      "cardTypeDesc": "公司员工卡-测试",
      "wechatParam": JSON.stringify(aaa)
    }

    // 修改
    // var aaa = {
    //   "card_id": "plqmg1dDBhbIpZR9nTuWi7vART8Q",
    //   "member_card": {
    //     "base_info": {
    //       "title": "公司管理卡",
    //       "notice": "出示二维码打开门禁",
    //       "description": "使用该会员卡可自由出入天德大厦"
    //     }
    //   }
    // }
    // var ssss = {
    //   "id": 5928,
    //   "cardKey": "plqmg1dDBhbIpZR9nTuWi7vART8Q",
    //   "cardName": "公司管理卡",
    //   "cardType": 3,
    //   "wechatParam": JSON.stringify(aaa)
    // }
    console.log(JSON.stringify(ssss));

    return;
    var timestampStr = parseInt(new Date().getTime() / 1000),
      // var timestampStr = '1553670468',
      code = '',
      card_id = 'plqmg1eUNAIyv2sc6lzpQ0o695YI',
      api_ticket = 'VUkHJgW2SFNG4xhs6ZntSP-P6TL0-PzyE_OBOAI8zqHotZGAVViAZFrt4wK9qvD_bFXdOrd6Aw6aytUEreLOww',
      nonce_str = 'Zhong' + timestampStr;
    var arr = [card_id, api_ticket, nonce_str, timestampStr]
    arr = arr.sort();
    var str = '';
    for (var i = 0; i < arr.length; i++) {
      str += arr[i];
    }
    console.log(arr);
    console.log(str);
    // return ;
    var signatureStr = app.appUtil.sha1(str);
    // signatureStr = 'e1642edb06e008a9cee1c14e806015f72e2558bf';
    console.log(signatureStr);
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
})