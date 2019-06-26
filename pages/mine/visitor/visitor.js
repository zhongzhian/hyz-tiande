// pages/mine/visitor/visitor.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey:"",
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onChange(e) {
    this.setData({
      searchKey: e.detail
    });
  },
  onSearch(event) {
    if (this.data.searchKey) {
      console.log("this.data.searchKey", this.data.searchKey);
      // wx.startPullDownRefresh();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('--- mine onShow ---')
    wx.startPullDownRefresh();
  },
  actionsTap(event) {
    let bindex = event.currentTarget.dataset.bindex;
    let item = event.currentTarget.dataset.item;
    this.setData({
      visible2: true,
      isAll: false
    });
  },
  clearTap() {
    this.setData({
      visible2: true,
      isAll: true,
      ['actions2[0].name']: '清除'
    });
  },
  handleCancel2() {
    this.setData({
      visible2: false,
      bindex: -1,
      isAll: false,
      ['actions2[0].name']: '删除'
    });
  },
  handleClickItem2() {
    if (this.data.isAll) {
      this.clearAll();
    } else {
      this.delItem();
    }
  },
  reInvite(event) {
    let item = event.currentTarget.dataset.item;
    let params = [];
    if (item.visitorName) {
      params.push("name=" + item.visitorName);
    }
    if (item.telphone) {
      params.push("telephone=" + item.telphone);
    }
    app.wechat.navigatorTo('../../visitor/invite/invite?' + params.join("&"));
  },
  delItem() {
    let item = this.data.historys[this.data.bindex];
    $Toast({
      content: '删除中',
      type: 'loading'
    });
    let ids = [item.id];
    app.wechat.fetchAPI('DELETE', app.api.COMMON_API.visitor.VISITOR, ids).then(res => {
      if (res.data.hyz_code === 20000) {
        var _historys = [...this.data.historys];
        _historys.splice(this.data.bindex, 1);
        this.setData({
          visible2: false,
          historys: _historys
        });
        $Toast({
          content: '删除成功',
          type: 'success'
        });
      }
    });
  },
  clearAll() {
    $Toast({
      content: '清除中',
      type: 'loading'
    });
    let ids = this.historys.map(h => h.id);
    app.wechat.fetchAPI('DELETE', app.api.COMMON_API.visitor.VISITOR, ids).then(res => {
      if (res.data.hyz_code === 20000) {
        this.setData({
          visible2: false,
          historys: []
        });
        $Toast({
          content: '清除成功',
          type: 'success'
        });
      }
    });
  },
  onPullDownRefresh: function () {
    this.getData();
  },
  loadMoreData() {
    this.getData();
  },
  getData() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    let hyz_userinfo = app.getHyzUserInfo();
    app.wechat.fetchAPI('GET', app.api.COMMON_API.visitor.MY_VISITOR).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            historys: res.data.hyz_result
          })
        }
      }
      this.stopPullDownRefresh();
    });
  },
  stopPullDownRefresh: function () {
    let _this = this;
    wx.stopPullDownRefresh({
      complete: function (res) {
        // _this.setData({
        //   loadmoreLoading: false
        // });
        $Toast.hide();
      }
    })
  },
})