// pages/info/info.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      vehiclePicture:"../../../image/car.jpg"
    },
    fee: 15
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _carnum = options.carnum;
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    if (_carnum) {
      app.wechat.fetchAPI('GET', app.api.COMMON_API.car.FIND_CAR + _carnum).then(res => {
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            this.setData({
              info: res.data.hyz_result
            })
            // wx.setStorageSync(app.hyzconst.CAR_INFO, res.data.hyz_result);
          } else {
            $Toast({
              content: '未查到车牌号',
              type: 'warning'
            });
          }
        }
      });
      // TODO 获取停车费
      app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.GET_RECORD_BYNUM + _carnum).then(res => {
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            // this.setData({
            //   fee: 22
            // })
          }
        }
      });
      this.setData({
        fee: 22
      })
    }
  },
  goPosition() {
    $Toast({
      content: '查找中',
      type: 'loading'
    });
    app.wechat.navigatorTo('../position/position');
    // app.wechat.navigatorTo('../position/position?posinfo=' + res.data.hyz_result.licensePlateNumber);
  },
  payFee(){
    $Toast({
      content: '未开放',
      type: 'warning'
    });
  },
  doScan() {
    $Toast({
      content: '解析中',
      type: 'loading'
    });
    app.wechat.scanCode().then(res => {
      console.log(res);
      if (res && res.result) {
        app.wechat.navigatorTo('../position/position?posinfo=京A111111&myloc=' + res.result);
      }
    })
  }
})