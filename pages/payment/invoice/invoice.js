// pages/payment/invoice/invoice.js
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
  reInvite(event) {
    let item = event.currentTarget.dataset.item;
    // let item = this.data.historys[this.data.bindex];
    app.wechat.navigatorTo('invite?name=' + item.visitorName + '&telephone=' + item.telphone);
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
    var params = {
      "page": this.data.pager.page,
      "pageSize": this.data.pager.pageSize,
      "searchParas": {
        "conditions": [{
          "name": "status",
          "op": "eq",
          "type": "int",
          "value": 1
        }],
        "logic": "and"
      },
      "sortDirection": "desc",
      "sortProperties": "createTime"
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.INVOICE_LIST, params).then(res => {
      // {
      //   "id": 4765,
      //     "execCount": 2,
      //       "telphone": "18768421105",
      //         "visitorName": "小小白",
      //           "visitorTime": "2019-04-13 13:41:09",
      //             "outTime": "2019-04-13 13:41:09",
      //               "inTime": "2019-04-13 13:41:09",
      //                 "createTime": "2019-04-13 13:41:09"
      // }
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
            resultlist = res.data.hyz_result.list.map(r => {
              let _arriveTimeStr = "",
                _leaveTimeStr = "";
              let _arriveTime = null,
                _leaveTime = null;
              if (r.visitorRecords && r.visitorRecords.length > 0) {
                for (var record of r.visitorRecords) {
                  let recordDate = new Date(record.createTime);
                  if (!_arriveTime) {
                    _arriveTimeStr = record.createTime;
                    _leaveTimeStr = record.createTime;
                    _arriveTime = recordDate;
                    _leaveTime = recordDate;
                  } else {
                    // 进入时间
                    if (recordDate < _arriveTime) {
                      _arriveTime = recordDate;
                    }
                    // 离开时间
                    if (recordDate > _leaveTime) {
                      _leaveTime = recordDate;
                    }
                  }
                }
                _arriveTimeStr = app.appUtil.formatTime(_arriveTime);
                _leaveTimeStr = app.appUtil.formatTime(_arriveTime);
              }
              r.arriveTime = _arriveTimeStr;
              r.leaveTime = _leaveTimeStr;
              return r;
            })
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