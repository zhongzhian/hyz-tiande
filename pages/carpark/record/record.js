// pages/carpark/record/record.js
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
  onLoad: function (options) {

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
  delItem() {
    let item = this.data.historys[this.data.bindex];
    $Toast({
      content: '删除中',
      type: 'loading'
    });
    let ids = [item.id];
    app.wechat.fetchAPI('DELETE', app.api.COMMON_API.parkinglot.PARKINGRECORD, ids).then(res => {
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
    app.wechat.fetchAPI('DELETE', app.api.COMMON_API.parkinglot.PARKINGRECORD, ids).then(res => {
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
    this.setData({
      pager: {
        page: 0,
        pageSize: 20
      }
    });
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
    let _isAll = this.data.isAll;
    var params = {
      "page": this.data.pager.page,
      "pageSize": this.data.pager.pageSize,
      "searchParas": {
        "conditions": [{
          "name": "person",
          "op": "eq",
          "type": "int",
          "value": hyz_userinfo.id
        }],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.parkinglot.PARKINGRECORD_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let _datas = this.data.historys;
          let _page = this.data.pager.page;
          let _isNoMore = false;
          _page++;
          let resultlist = [];
          // 没数据
          if (res.data.hyz_result.list.length === 0) {
            _isNoMore = true;
          } else {
            // 处理数据，record取进出数据
            resultlist = res.data.hyz_result.list;
          }

          // 首次
          if (this.data.pager.page === 0) {
            _datas = resultlist;
            if (resultlist.length < 20) {
              _isNoMore = true;
            }
          } else {
            // loadmore
            _datas = _datas.concat(resultlist);
            _isAll = false;
          }
          this.setData({
            historys: _datas,
            isNoMore: _isNoMore,
            loadmoreLoading: false,
            isAll: _isAll,
            pager: {
              page: _page,
              pageSize: 10
            }
          });
        }
      }
      this.setData({
        loadmoreLoading: false
      });
      this.stopPullDownRefresh();
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('--- mine onReachBottom ---');
    if (!this.data.isNoMore) {
      this.setData({
        loadmoreLoading: true
      });
      this.loadMoreData();
    }
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