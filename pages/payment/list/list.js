// pages/payment/list/list.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2: false,
    actions2: [{
      name: '删除',
      color: '#ed3f14'
    }],
    loadmoreLoading: false,
    isNoMore: false,
    bindex: -1,
    isAll: false,
    historys: [],
    pager: {
      page: 0,
      pageSize: 20
    },
    orderNum: 0,
    totalPrice: '0.00',
    statusArr: ["取消", "待付款", "付款中", "付款成功", "付款失败"]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // wx.startPullDownRefresh();
  },
  goToPay() {
    console.log("orderNum", this.data.orderNum);
    if (this.data.orderNum === 0) return;
  },
  changeCheck(event) {
    let item = event.currentTarget.dataset.item;
    let bindex = event.currentTarget.dataset.bindex;
    item.selected = !item.selected;
    let historys = this.data.historys;
    historys[bindex] = item;
    this.setData({
      historys: historys
    })
    // this.setTotal();
    this.updateAllcheck();
  },
  allcheckChange(e) {
    let isAll = !this.data.isAll;
    console.log('--- isAll ---', isAll)
    let historys = this.data.historys.map(h => {
      h.selected = isAll;
      return h;
    })
    this.setData({
      isAll: isAll,
      historys: historys
    })
    this.setTotal();
  },
  updateAllcheck() {
    let isAll = true;
    let historys = this.data.historys.map(h => {
      isAll = isAll && h.selected;
      return h;
    })
    this.setData({
      isAll: isAll
    })
    this.setTotal();
  },
  setTotal() {
    let orderNum = 0,
      totalPrice = 0;
    this.data.historys.map(h => {
      if (h.selected) {
        orderNum++;
        let money = h.money || 0;
        totalPrice = totalPrice + money;
      }
    })
    // var ss = 2.2998; ss.toFixed(2)
    this.setData({
      orderNum: orderNum,
      totalPrice: totalPrice
    })
  },
  onPullDownRefresh: function() {
    this.getData();
  },
  getData() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    // let hyz_userinfo = app.getHyzUserInfo();
    let that = this;
    let params = {
      "searchParas": {
        "conditions": [{
          "name": "orderStatus",
          "op": "eq",
          "type": "int",
          "value": 1
        }],
        "logic": "and"
      },
    }
    app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.ORDER_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let historys = res.data.hyz_result.list.map(h => {
            h.statusStr = that.data.statusArr[h.orderStatus];
            h.selected = false;
            return h;
          })
          this.setData({
            historys: res.data.hyz_result.list
          })
        }
      }
      this.stopPullDownRefresh();
    });
  },
  stopPullDownRefresh: function() {
    let _this = this;
    wx.stopPullDownRefresh({
      complete: function(res) {
        // _this.setData({
        //   loadmoreLoading: false
        // });
        $Toast.hide();
      }
    })
  },
})