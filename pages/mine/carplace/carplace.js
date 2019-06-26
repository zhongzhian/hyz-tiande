// pages/mine/carplace/carplace.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myRent: null,
    x: 0,
    y: 0,
    svgUrl: '../../../image/bg.svg',
    // svgUrl: '',
    scale: 0.5,
    textLeftAnimation: {},
    myinterval: 0,
    carLeft: 700,
    carTop: 700,
    mySpace: null,
    showModal: false,
    spaceId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let spaceId = options.id;
    if (spaceId) {
      this.setData({
        spaceId: spaceId
      })
      this.getMySpace();
    }
  },
  getMySpace() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.car.SPACE + '/' + this.data.spaceId).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            mySpace: res.data.hyz_result
          })
          this.drawCar();
        } else {
          this.setData({
            showModal: true
          })
        }
      } else {
        this.setData({
          showModal: true
        })
      }
    })
  },
  drawCar() {
    let _info = this.data.mySpace;
    let aaa = 1920 / 1920,
      bbb = 1080 / 1080;
    let carX = this.data.carLeft,
      carY = this.data.carTop,
      _svgUrl = '../../../image/bg.svg';
    if (_info.point1X) {
      carX = (_info.point1X + _info.point2X + _info.point3X + _info.point4X) / 4;
      carY = (_info.point1Y + _info.point2Y + _info.point3Y + _info.point4Y) / 4;
    }
    carX = carX * aaa;
    carY = carY * bbb;
    if (_info.parkingLot) {
      // console.log('底图:::::' + app.api.SVG_ROOT + _info.parkingLot.planeGraph);
      _svgUrl = app.api.SVG_ROOT + _info.parkingLot.planeGraph;
    }
    this.setData({
      carLeft: carX,
      carTop: carY,
      svgUrl: _svgUrl
    });

    this.moveToPoint(carX, carY);
  },
  setAni() {
    let self = this;
    let _interval = setInterval(function() {
      let animationLeft = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-out',
        delay: 0
      })

      animationLeft.scale(5).opacity(0).step();
      animationLeft.scale(0.1).opacity(1).step();
      self.setData({
        textLeftAnimation: animationLeft.export()
      })
    }, 2000);

    this.setData({
      myinterval: _interval
    })
  },
  moveToPoint(x, y) {
    // let centerX = -150 - x * this.data.scale,
    //   centerY = -100 - y * this.data.scale;
    let centerX = 100 - x * this.data.scale,
      centerY = -y * this.data.scale;
    // let centerX = 0,
    //   centerY = 0;
    console.log(centerX + ' -- center -- ' + centerY)
    this.setData({
      x: centerX,
      y: centerY
    });
  },
  zoomMax() {
    this.setData({
      scale: 1
    })
  },
  zoomMin() {
    this.setData({
      scale: 0.5
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setAni();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.myinterval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.myinterval);
  },
  backPre() {
    wx.navigateBack({
      delta: 1
    })
  }
})