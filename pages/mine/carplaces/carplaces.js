// pages/mine/carplaces/carplaces.js
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('--- mine onShow ---')
    wx.startPullDownRefresh();
  },
  actionsTap(event) {
    let bindex = event.currentTarget.dataset.bindex;
    let item = event.currentTarget.dataset.item;
    this.setData({
      visible2: true,
      bindex: bindex,
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
  delItem() {
    let item = this.data.historys[this.data.bindex];
    $Toast({
      content: '删除中',
      type: 'loading'
    });
    let ids = [];
    ids.push(item.id);
    console.log("item", item);
    console.log("item.id", item.id);
    console.log("ids", ids);
    // return;
    app.wechat.fetchAPI('DELETE', app.api.COMMON_API.parkinglot.USERCAR, ids).then(res => {
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
    app.wechat.fetchAPI('DELETE', app.api.COMMON_API.parkinglot.USERCAR, ids).then(res => {
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
  editTap(event) {
    let item = event.currentTarget.dataset.item;
    app.wechat.navigatorTo('../carplace/carplace?id=' + item.parkingSpace);
  },
  addTap() {
    app.wechat.navigatorTo('../car/car');
  },
  onPullDownRefresh: function() {
    this.getData();
  },
  getData() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.PLACE_GETMY).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let historys = res.data.hyz_result.map(h => {
            let cars = h.parkingSpaceCars.map(c => c.licensePlateNumber);
            h.parkingSpaceCarsStr = cars.length > 0 ? cars.join(",") : '无'
            return h;
          })
          this.setData({
            historys: historys
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