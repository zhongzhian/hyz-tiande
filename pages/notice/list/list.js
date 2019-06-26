// pages/notice/list/list.js
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
  detail(event) {
    let item = event.currentTarget.dataset.item;
    // let item = this.data.historys[this.data.bindex];
    app.wechat.navigatorTo('../info/info?id=' + item.id);
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
      // "searchParas": {
      //   "conditions": [{
      //     "name": "informationSource",
      //     "op": "eq",
      //     "type": "string",
      //     "value": app.getHyzUserCompany()
      //   }],
      //   "logic": "and"
      // },
      // "sortDirection": "desc",
      // "sortProperties": "releaseTime"
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.ANNOUNCEMENT_LIST, params).then(res => {
      // {
      //   "id": "8aaa0d8c6a4de068016a4f876bca0007",
      //     "userId": 5881,
      //       "personName": "扉页",
      //         "informationSource": "物业公司",
      //           "location": "",
      //             "content": "本周将进行线路保养，周六晚上12点断电一小时。请各单位自行安排工作。",
      //               "description": "有问题请及时联系物业",
      //                 "releaseTime": "2019-04-24 21:27:16",
      //                   "createTime": "2019-04-24 21:27:18",
      //                     "updateTime": "2019-04-24 21:27:18"
      // },
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let _datas = this.data.historys;
          let _page = this.data.pager.page;
          let _isNoMore = false;
          _page++;
          if (res.data.hyz_result.list.length === 0) {
            _isNoMore = true;
          }
          if (this.data.pager.page === 0) {
            _datas = res.data.hyz_result.list;
            if (res.data.hyz_result.list.length < 20) {
              _isNoMore = true;
            }
          } else {
            _datas = _datas.concat(res.data.hyz_result.list);
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