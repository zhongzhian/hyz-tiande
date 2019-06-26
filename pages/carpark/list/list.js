// pages/list/list.js
const app = getApp();
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',
    endTime: '',
    carnum: '',
    licensePlateNumber: '',
    carList: [],
    showMadel: false,
    loading: true,
    actions1: [{
        name: '查看更多信息,进一步确认车辆',
      },
      {
        name: '已确认车辆,直接引导车位'
      }
    ],
    actions: [{
        name: '更多信息',
        color: '#2d8cf0',
      },
      {
        name: '引导车位',
        color: '#19be6b'
      },
      {
        name: '取消'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _start = options.start;
    // let _end = options.end;
    let _carnum = options.carnum;
    // let _start = '2018-11-01 00:00:00';
    // let _end = '2018-12-01 00:00:00';

    this.setData({
      startTime: _start,
      // endTime: _end,
      carnum: _carnum
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('--- list onShow ---')
    wx.startPullDownRefresh();
  },
  tapMaybe(event) {
    let bindex = event.currentTarget.dataset.bindex;
    let item = event.currentTarget.dataset.item;
    this.gotoPosition(item.licensePlateNumber);
  },
  gotoPosition(carnum) {
    // console.log('../position/position?carnum=' + carnum);
    app.wechat.navigatorTo('../position/position?carnum=' + carnum);
  },
  handleClick({
    detail
  }) {
    const index = detail.index;
    let self = this;
    console.log(index);
    if (index === 0) {
      app.wechat.navigatorTo('../info/info?carnum=' + this.data.licensePlateNumber);
    } else {
      app.wechat.navigatorTo('../position/position');
    }
    // setTimeout(function(){
    //   self.setData({
    //     showMadel: false
    //   });
    // }, 1000);
    this.setData({
      showMadel: false
    });
    $Toast({
      content: '跳转中',
      type: 'loading'
    });
  },
  handleCancel() {
    this.setData({
      showMadel: false
    });
  },
  itemTap(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    if (this.data.carnum) {
      app.wechat.navigatorTo('../info/info?carnum=' + item.licensePlateNumber);
    } else {
      wx.setStorageSync(app.hyzconst.CAR_INFO, item);
      this.setData({
        licensePlateNumber: item.licensePlateNumber,
        showMadel: true
      })
    }
  },
  onPullDownRefresh: function() {
    let _start = this.data.startTime;
    let _end = this.data.endTime;
    let _carnum = this.data.carnum;
    if (_carnum) {
      $Toast({
        content: '加载中',
        type: 'loading'
      });
      console.log(app.api.FIND_CAR + _carnum);
      app.wechat.fetchAPI('GET', app.api.FIND_CAR + _carnum).then(res => {
        console.log(res);
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            this.setData({
              carList: res.data.hyz_result.maybe
            });
            $Toast.hide();
          } else {
            $Toast({
              content: '未查到车牌号',
              type: 'warning'
            });
          }
        }
        this.stopPullDownRefresh();
      });
    } else {
      let params = {
        startTime: _start + " 00:00:00",
        endTime: app.appUtil.formatTime(new Date())
      };

      $Toast({
        content: '加载中',
        type: 'loading'
      });

      app.wechat.fetchAPI('POST', app.api.COMMON_API.car.FIND_CAR_TIME, params).then(res => {
        console.log(res);
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            this.setData({
              carList: res.data.hyz_result
            });
            $Toast.hide();
          } else {
            $Toast({
              content: '未查到该车牌尾号的车',
              type: 'warning'
            });
          }
        }
        this.stopPullDownRefresh();
        this.setData({
          loading: false
        })
      });
    }
  },
  stopPullDownRefresh: function() {
    wx.stopPullDownRefresh({
      complete: function(res) {
        console.log(res, new Date());
      }
    })
  }
})