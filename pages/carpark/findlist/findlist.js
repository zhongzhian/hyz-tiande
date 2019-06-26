// pages/findlist/findlist.js
const app = getApp();
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carnum: '',
    info: {},
    carList: [],
    showMadel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _carnum = options.carnum;
    // _carnum = '京HY0978';

    $Toast({
      content: '加载中',
      type: 'loading'
    });
    app.wechat.fetchAPI('GET', app.api.COMMON_API.car.FIND_CAR + _carnum).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // res.data.hyz_result.maybe = [{
          //   "licensePlateNumber": "京HY0978",
          //   "vehiclePicture": res.data.hyz_result.vehiclePicture
          // }, {
          //   "licensePlateNumber": "京HY0978",
          //     "vehiclePicture": "../../../image/car.jpg"
          // }, {
          //   "licensePlateNumber": "京HY0978",
          //     "vehiclePicture": "../../../image/car.jpg"
          // }];
          this.setData({
            info: res.data.hyz_result
          })
        } else {
          $Toast({
            content: '未查到车牌号',
            type: 'warning'
          });
        }
      }
    });
  },
  infoTap() {
    app.wechat.navigatorTo('../info/info?carnum=' + this.data.info.licensePlateNumber);
  },
  maybeTap(e) {
    let item = e.currentTarget.dataset.item;
    app.wechat.navigatorTo('../info/info?carnum=' + item.licensePlateNumber);
  }
})