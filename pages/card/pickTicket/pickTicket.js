// pages/card/pickTicket/pickTicket.js
//获取应用实例
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');

Page({
  data: {
    current: 'canuse',
    historys: [],
    notlist: [],
    pager: {
      page: 0,
      pageSize: 20
    },
    loadmoreLoading: false,
    isNoMore: false,
    notpager: {
      page: 0,
      pageSize: 20
    },
    loadmoreLoading_not: false,
    isNoMore_not: false,
    paymentId: 0,
    coupon:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let paymentId = options.paymentId;
    let _coupon = options.coupon;
    if (paymentId) {
      this.setData({
        paymentId: paymentId
      })
    }
    if (_coupon) {
      this.setData({
        coupon: _coupon
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('--- mine onShow ---')
    wx.startPullDownRefresh();
  },
  btnTap(event) {
    let bindex = event.currentTarget.dataset.bindex;
    let item = event.currentTarget.dataset.item;
    console.log("item", item);
    if (this.data.paymentId) {
      this.bindTicket(item);
    }
  },
  changeCheck(event) {
    let item = event.currentTarget.dataset.item;
    let bindex = event.currentTarget.dataset.bindex;
    let historys = this.data.historys.map(h => {
      if (h.id === item.id) {
        h.selected = !h.selected;
      } else {
        h.selected = false;
      }
      return h;
    });
    this.setData({
      historys: historys
    })
  },
  bindsumit() {
    let item = this.data.historys.find(h => h.selected);
    console.log("item", item);
    if (item) {
      this.bindTicket(item);
    } else {
      this.unbindTicket(item);
    }
  },
  unbindTicket(item) {
    let params = {
      // couponId: item.id,
      paymentId: this.data.paymentId
    }
    app.wechat.fetchAPI('PUT', app.api.COMMON_API.parkinglot.UNBIND_COUPON + "/" + this.data.paymentId, params).then(res => {
      if (res.data.hyz_code === 20000) {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  bindTicket(item) {
    let params = {
      couponId: item.id,
      paymentId: this.data.paymentId
    }
    app.wechat.fetchAPI('PUT', app.api.COMMON_API.parkinglot.BIND_COUPON, params).then(res => {
      if (res.data.hyz_code === 20000) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        $Toast({
          content: res.data.hyz_message,
          type: 'error'
        });
      }
    });
  },
  onPullDownRefresh: function() {
    this.setData({
      pager: {
        page: 0,
        pageSize: 20
      },
      notpager: {
        page: 0,
        pageSize: 20
      }
    });
    this.getData();
    this.getNotData();
  },
  loadMoreData() {
    this.getData();
  },
  loadMoreNotData() {
    this.getNotData();
  },
  getData() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });

    let hyz_userinfo = app.getHyzUserInfo();
    var params = {
      "page": this.data.pager.page,
      "pageSize": this.data.pager.pageSize,
      "searchParas": {
        "conditions": [{
          "name": "person",
          "op": "eq",
          "type": "int",
          "value": hyz_userinfo.id
        }, {
          "name": "status",
          "op": "eq",
          "type": "int",
          "value": "1"
        }],
        "logic": "and"
      },
      "sortDirection": "desc",
      "sortProperties": "updateTime"
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.COUPON_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let _coupon = this.data.coupon;
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
            resultlist = res.data.hyz_result.list.map(r => {
              r.selected = (r.id === _coupon);
              return r;
            });
            // resultlist = resultlist.concat(res.data.hyz_result.list);
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
          }
          this.setData({
            historys: _datas,
            isNoMore: _isNoMore,
            loadmoreLoading: false,
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
  getNotData() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    let hyz_userinfo = app.getHyzUserInfo();
    var params = {
      "page": this.data.notpager.page,
      "pageSize": this.data.notpager.pageSize,
      "searchParas": {
        "conditions": [{
          "name": "person",
          "op": "eq",
          "type": "int",
          "value": hyz_userinfo.id
        }, {
          "name": "status",
          "op": "noeq",
          "type": "int",
          "value": "1"
        }],
        "logic": "and"
      },
      "sortDirection": "desc",
      "sortProperties": "updateTime"
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.COUPON_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let _datas = this.data.notlist;
          let _page = this.data.notpager.page;
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
          if (this.data.notpager.page === 0) {
            _datas = resultlist;
            if (resultlist.length < 20) {
              _isNoMore = true;
            }
          } else {
            // loadmore
            _datas = _datas.concat(resultlist);
          }
          this.setData({
            notlist: _datas,
            isNoMore_not: _isNoMore,
            loadmoreLoading_not: false,
            notpager: {
              page: _page,
              pageSize: 10
            }
          });
          // this.setData({
          //   notlist: res.data.hyz_result.list
          // });
        }
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('--- mine onReachBottom ---');
    if (this.data.current === 'canuse') {
      if (!this.data.isNoMore) {
        this.setData({
          loadmoreLoading: true
        });
        this.loadMoreData();
      }
    } else {
      if (!this.data.isNoMore_not) {
        this.setData({
          loadmoreLoading_not: true
        });
        this.loadMoreNotData();
      }
    }
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
  switchCheckWay({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
})