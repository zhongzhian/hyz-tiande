// pages/mine/invitation/invitation.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadmoreLoading: false,
    isNoMore: false,
    bindex: -1,
    historys: []
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
  detail(event) {
    let item = event.currentTarget.dataset.item;
    // let item = this.data.historys[this.data.bindex];
    app.wechat.navigatorTo('../../visitor/invitation/invitation?inviteId=' + item.id);
  },
  onPullDownRefresh: function() {
    this.getData();
  },
  getData() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    let hyz_userinfo = app.getHyzUserInfo();
    var params = {
      "searchParas": {
        "conditions": [{
            "name": "userId",
            "op": "eq",
            "type": "int",
            "value": hyz_userinfo.id
          },
          {
            "name": "visitorStatus",
            "op": "eq",
            "type": "int",
            "value": 1
          }
        ],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.visitor.VISITOR_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // 处理数据，record取进出数据
          let resultlist = res.data.hyz_result.list.map(r => {
            let _visiteDate = "",
              _visiteStart = "",
              _visiteEnd = "";
            if (r.visitorStartTime) {
              let startarr = r.visitorStartTime.split(" ");
              _visiteDate = startarr[0];
              _visiteStart = startarr[1];
              _visiteEnd = r.visitorEndTime.split(" ")[1];
            }
            r.visiteDate = _visiteDate;
            r.visiteStart = _visiteStart;
            r.visiteEnd = _visiteEnd;
            return r;
          })
          this.setData({
            historys: resultlist
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
        $Toast.hide();
      }
    })
  },
})