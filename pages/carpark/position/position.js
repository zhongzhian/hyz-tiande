// pages/position/position.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    resultText: '',
    carResult: '',
    myloc: '',
    // x: -60,
    // y: -125,
    x: 0,
    y: 0,
    // svgUrl: '../../image/bg.svg',
    svgUrl: '',
    scale: 0.1,
    textLeftAnimation: {},
    lineAnimation: {},
    myinterval: 0,
    lineinterval: 0,
    jiantouleft: 0,
    hidPerson: true,
    // carLeft: 0,
    // carTop: 0,
    // personLeft: 0,
    // personTop: 0,
    carLeft: 700,
    carTop: 700,
    personLeft: 800,
    personTop: 800,
    pointList: [],
    dotList: [],
    lineList: [],
    pakingSpaceId: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _carnum = options.carnum;
    console.log("_carnum", _carnum);
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
            this.drawCar();
            // wx.setStorageSync(app.hyzconst.CAR_INFO, res.data.hyz_result);
          } else {
            $Toast({
              content: '未查到车牌号',
              type: 'warning'
            });
          }
        }
      });
    }
  },
  drawCar() {
    let _info = this.data.info;
    let aaa = 1920 / 1920,
      bbb = 1080 / 1080;
    let carX = 0,
      carY = 0,
      _svgUrl = '../../image/bg.svg';
    if (_info.point1X) {
      carX = (_info.point1X + _info.point2X + _info.point3X + _info.point4X) / 4;
      carY = (_info.point1Y + _info.point2Y + _info.point3Y + _info.point4Y) / 4;
    }
    carX = carX * aaa;
    carY = carY * bbb;
    if (_info.parkingLot) {
      console.log('底图:::::' + _info.parkingLot.planeGraph);
      _svgUrl = _info.parkingLot.planeGraph;
    }
    console.log(carX + ' ---- ' + carY)
    this.setData({
      info: _info,
      carLeft: carX,
      carTop: carY,
      svgUrl: _svgUrl,
      pakingSpaceId: _info.serialNumber
    });

    // this.setAni();
    this.moveToPoint(carX, carY);

    let uniqueKey = wx.getStorageSync(app.hyzconst.SCAN_POINT);
    if (uniqueKey) {
      let _this = this;
      setTimeout(function () {
        console.log('this.drawPoint(uniqueKey):::::');
        _this.drawPoint(uniqueKey);
      }, 3000);
      // wx.nextTick(function() {
      //   console.log('this.drawPoint(uniqueKey):::::');
      //   _this.drawPoint(uniqueKey);
      //   console.log('this.drawPoint(uniqueKey):::::11');
      // })
    }
  },
  doScan() {
    // $Toast({
    //   content: '解析中',
    //   type: 'loading'
    // });
    app.wechat.scanCode().then(res => {
      console.log(res);
      if (res && res.result) {
        let urlarr = res.result.split('/');
        console.log(urlarr);
        this.drawPoint(urlarr[urlarr.length - 1]);
      }
    })
  },
  drawPoint(uniqueKey) {
    let params = {
      "uniqueKey": uniqueKey,
      // "parkingSpaceId": this.data.info.id,
      "parkingSpaceId": "8aaada566b64e5bd016b8c37c86d0006"
    }; 
    app.wechat.fetchAPI('POST', app.api.COMMON_API.car.GET_SCAN, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          let points = res.data.hyz_result.points;
          if (points.length > 0) {
            points.splice(0, 1);
          }
          this.setData({
            hidPerson: false,
            personLeft: res.data.hyz_result.x,
            personTop: res.data.hyz_result.y,
            pointList: points
            // pointList: [{ x: 780, y: 730 }, { x: 700, y: 800 }, { x: 700, y: 730 }]
          });
          this.moveToPoint(res.data.hyz_result.x, res.data.hyz_result.y);
          this.setLine();
        } else {
          $Toast({
            content: '未找到定位点',
            type: 'warning'
          });
        }
      } else {
        $Toast({
          content: '未找到定位点',
          type: 'warning'
        });
      }
    });
  },
  setLine() {
    let pointlist = this.data.pointList;
    let preX = this.data.personLeft;
    let preY = this.data.personTop;
    let lastX = this.data.carLeft;
    let lastY = this.data.carTop;
    let lineList = [];
    if (pointlist) {
      for (var i = 0; i < pointlist.length; i++) {
        let point = pointlist[i];
        let _x = Math.abs(point.x - preX);
        let _y = Math.abs(point.y - preY);
        let length = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));
        let tan = Math.atan2((point.y - preY), (point.x - preX));
        console.log(tan + '---' + length);
        let line = {
          "width": length,
          "x": point.x,
          "y": point.y,
          "tx": (preX - point.x - length) / 2,
          "ty": (preY - point.y) / 2,
          "rad": tan
        }
        lineList.push(line);
        preX = point.x;
        preY = point.y;
      }
    }
    let _x = Math.abs(lastX - preX);
    let _y = Math.abs(lastY - preY);
    let length = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));
    let tan = Math.atan2((lastY - preY), (lastX - preX));
    let line = {
      "width": length,
      "x": lastX,
      "y": lastY,
      "tx": (preX - lastX - length) / 2,
      "ty": (preY - lastY) / 2,
      "rad": tan
    }
    lineList.push(line);
    this.setData({
      lineList: lineList
    })
  },
  setDotList() {
    let pointlist = this.data.pointList;
    let preX = this.data.personLeft;
    let preY = this.data.personTop;
    let dotlist = [];
    for (var i = 0; i < pointlist.length; i++) {
      let point = pointlist[i];
      let _x = point.x - preX;
      let _y = point.y - preY;
      let length = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));
    }
  },
  setAni() {
    let self = this;
    let _interval = setInterval(function () {
      let animationLeft = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-out',
        delay: 0
      })

      animationLeft.scale(5).opacity(0).step();
      animationLeft.scale(0.1).opacity(1).step();

      // let animationLine = wx.createAnimation({
      //   duration: 1000,
      //   timingFunction: 'linear',
      //   delay: 0
      // })
      // animationLine.left(100).step();
      // animationLine.left(0).step();

      self.setData({
        textLeftAnimation: animationLeft.export(),
        // lineAnimation: animationLine.export()
      })
    }, 2000);

    let _lineinterval = setInterval(function () {
      let _jiantouleft = self.data.jiantouleft;
      _jiantouleft++;
      if (_jiantouleft > 100) {
        _jiantouleft = 0
      }
      self.setData({
        jiantouleft: _jiantouleft
      })
    }, 100);

    this.setData({
      myinterval: _interval,
      lineinterval: _lineinterval
    })
  },
  moveToPoint(x, y) {
    let centerX = -150 - x * this.data.scale,
      centerY = -100 - y * this.data.scale;
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
      scale: 0.1
    })
  },
  goIndex() {
    app.wechat.navigatorTo('../index/index').catch(e => {
      console.log(e);
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setAni();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("----------------- position:onHide")
    clearInterval(this.data.myinterval);
    clearInterval(this.data.lineinterval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("----------------- position:onUnload")
    clearInterval(this.data.myinterval);
    clearInterval(this.data.lineinterval);
  },
})