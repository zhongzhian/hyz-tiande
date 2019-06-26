//app.js
const util = require('./utils/util.js')
const wechat = require('./utils/wechat.js');
const hyzconst = require('./utils/const.js');
const api = require('./utils/api.js');

App({
  appUtil: util,
  wechat: wechat,
  hyzconst: hyzconst,
  api: api,
  onLaunch: function() {
    console.log("--------------------------App onLoad");
    //获取设备信息
    this.getSystemInfo();

    // 登录
    this.wechat.login().then(res => {
      this.wechat.fetch('POST', this.api.COMMON_API.common.WECHAT_LOGIN, {
        'code': res.code
      }).then(res => {
        if (res.statusCode === 200) {
          wx.setStorageSync(this.hyzconst.AJAX_TOKEN, res.data);
          return this.wechat.fetchAPI('GET', this.api.COMMON_API.common.USER_CURRENT);
        }
      }).then(res => {
        if (res.data.hyz_code === 20000) {
          this.setHyzUserInfo(res.data.hyz_result);
          console.log("hyz_userinfo", res.data.hyz_result);
        }
      }).catch(e => {
        console.log(e);
      })
    })
  },
  getSystemInfo: function() {
    let t = this;
    wx.getSystemInfo({
      success: function(res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  getHyzUserInfo() {
    let hyz_userinfo = wx.getStorageSync(this.hyzconst.HYZ_USER_INFO);
    return hyz_userinfo;
  },
  setHyzUserInfo(info) {
    wx.setStorageSync(this.hyzconst.HYZ_USER_INFO, info);
    this.getOrganization(info);
  },
  updateHyzUserInfo(info) {

  },
  getHyzUserCompany() {
    let company = wx.getStorageSync(this.hyzconst.HYZ_USER_COMPANY);
    return company;
  },
  getOrganization(hyz_userinfo) {
    if (hyz_userinfo.rootOrganization) {
      let company = {
        id: hyz_userinfo.rootOrganization.id,
        name: hyz_userinfo.rootOrganization.organizationName
      }
      wx.setStorageSync(this.hyzconst.HYZ_USER_COMPANY, company);
    }
  },
  handleQrcode(result) {
    let url = decodeURIComponent(result);
    let urlarr = url.split('/');
    let basePath = this.api.COMMON_API.common.QRCODE_DOMAIN;
    // var re = new RegExp("\\w+");
    // var substr = str2.match(/ab\S*d(\S*)ff/);

    //申请领卡
    //"http://turbo.linkme8.cn/tiande/card/apply/" + this.data.ticketInfo.id;
    if (url.indexOf(basePath + "card/apply/") === 0) {
      console.log("申请领卡", url);
      this.wechat.navigatorTo('../card/apply');
      return;
    }

    //优惠券发放二维码
    //"http://turbo.linkme8.cn/tiande/coupon/" + this.data.ticketInfo.id;
    if (url.indexOf(basePath + "coupon/") === 0 ) {
      console.log("优惠券发放二维码", url);
      this.wechat.navigatorTo('../card/addTicket/addTicket?couponId=' + urlarr[urlarr.length - 1]);
      return;
    }

    //无牌车入场
    //"http://turbo.linkme8.cn/tiande/lpgs/carin/" + this.data.ticketInfo.id;
    if (url.indexOf(basePath + "lpgs/carin/") === 0) {
      console.log("无牌车入场", url);
      this.wechat.navigatorTo('../carpark/nonum/nonum?gate=' + urlarr[urlarr.length - 1]);
      return;
    }

    //无牌车出场
    //"http://turbo.linkme8.cn/tiande/lpgs/carout/" + this.data.ticketInfo.id;
    if (url.indexOf(basePath + "lpgs/carout/") === 0) {
      console.log("无牌车出场", url);
      this.wechat.navigatorTo('../carpark/payfee/payfee?gate=' + urlarr[urlarr.length - 1]);
      return;
    }
  },
  dealFormIds: function(formId) {
    if (formId === "the formId is a mock one") return;
    let hyz_userinfo = wx.getStorageSync(this.hyzconst.HYZ_USER_INFO);
    let formIds = this.globalData.gloabalFomIds; //获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      userId: hyz_userinfo.id,
      formId: formId,
      expire: parseInt(new Date().getTime()) + 604800000
    }
    formIds.push(data); //将data添加到数组的末尾
    this.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },
  globalData: {
    appCompanyName: "天德广场",
    appWuyeTel: "13333333333",
    companyVersion: "by defencedriver v1.0.0",
    systemInfo: null, //客户端设备信息
    userInfo: null,
    gloabalFomIds: []
  }
})