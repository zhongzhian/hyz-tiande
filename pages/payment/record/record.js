// pages/payment/record/record.js
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
    totalPrice: '0.00'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    //TODO 开发票
    let ids = [];
    this.data.historys.map(h => {
      if (h.selected) {
        ids.push(h.id);
      }
    });

    if(ids.length>0){
      console.log('../invoiceTitle/invoiceTitle?ids=' + ids.join(",") + "&money=" + this.data.totalPrice);
      app.wechat.navigatorTo('../invoiceTitle/invoiceTitle?ids=' + ids.join(",") + "&money=" + this.data.totalPrice);
    }
    // wx.chooseInvoiceTitle({
    //   success(res) { }
    // })
    
    // let params = {
    //   "companyAddress": "string",
    //   "companyName": "string",
    //   "companyTel": "string",
    //   "contact": "string",
    //   "contactEmail": "string",
    //   "contactMobile": "string",
    //   "fileUrl": "string",
    //   "openBank": "string",
    //   "openCardNo": "string",
    //   "orderIds": [
    //     0
    //   ],
    //   "status": 0,
    //   "taxFile": "string",
    //   "taxNo": "string"
    // }
    // app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.ORDER_LIST, params).then(res => {
    //   if (res.data.hyz_code === 20000) {
    //     if (res.data.hyz_result) {
    //       let historys = res.data.hyz_result.list.map(h => {
    //         h.selected = false;
    //         return h;
    //       })
    //       this.setData({
    //         historys: res.data.hyz_result.list
    //       })
    //     }
    //   }
    //   this.stopPullDownRefresh();
    // });
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
    // let hyz_userinfo = app.getHyzUserInfo();
    let _isAll = this.data.isAll;
    let params = {
      "page": this.data.pager.page,
      "pageSize": this.data.pager.pageSize,
      "searchParas": {
        "conditions": [{
          "name": "orderStatus",
          "op": "eq",
          "type": "int",
          "value": 3
        }],
        "logic": "and"
      },
      "sortDirection": "desc",
      "sortProperties": "updateTime"
    }
    app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.ORDER_LIST, params).then(res => {
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
              r.selected = false;
              return r;
            });
          }

          // 首次
          if (this.data.pager.page === 0) {
            _datas = resultlist;
            if (resultlist.length < 20) {
              _isNoMore = true;
            }
            _isAll = false;

            this.setData({
              orderNum: 0,
              totalPrice: '0.00'
            });
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
  scrollTop(){

  },
  scrollBottom() {
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