// pages/card/ticketTypeList/ticketTypeList.js
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
  btnTap(event) {
    let bindex = event.currentTarget.dataset.bindex;
    let item = event.currentTarget.dataset.item;
    console.log("item", item);
    app.wechat.navigatorTo('../erweima/erweima?couponTypeId=' + item.id);
  },
  onPullDownRefresh: function() {
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
      "pageSize": this.data.pager.pageSize
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.COUPON_TYPE_LIST, params).then(res => {
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
  onReachBottom: function() {
    console.log('--- mine onReachBottom ---');
    if (!this.data.isNoMore) {
      this.setData({
        loadmoreLoading: true
      });
      this.loadMoreData();
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
})