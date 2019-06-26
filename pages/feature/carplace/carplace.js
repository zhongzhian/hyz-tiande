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
    // svgUrl: '../../../image/bg.svg',
    svgUrl: '',
    scale: 1,
    textLeftAnimation: {},
    myinterval: 0,
    carLeft: 700,
    carTop: 700,
    colors: ["#19be6b", "#f90", "#ed3f14"],
    spinShow: true,
    canScale:false,
    ctx: null,
    parkingLots: [],
    parkingLotNames: [],
    selectType:"area",
    parkingLot: null,
    parkingArea: null,
    parkingPlace:null,
    areas: [],
    places: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLots();
    let ctx = wx.createCanvasContext('myCanvas');
    // ctx.setFontSize(60);
    // ctx.scale(0.1, 0.1);
    // ctx.drawImage(this.data.svgUrl, 0, 0);
    // ctx.draw();
    this.setData({
      ctx: ctx
    })
  },
  getLots() {
    let params = {};
    app.wechat.fetchAPI('POST', app.api.COMMON_API.car.LOT_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          if (res.data.hyz_result.totalNum > 0) {
            let parkingLotNames = res.data.hyz_result.list.map(p => p.name);
            this.setData({
              parkingLots: res.data.hyz_result.list,
              parkingLotNames: parkingLotNames,
              parkingLot: res.data.hyz_result.list[0],
              svgUrl: res.data.hyz_result.list[0].planeGraph
            })
            this.fetchFloorArea();
          }
        }
      }
    })
  },
  bindLotChange: function(e) {
    console.log("e.detail.value", e.detail.value);
    let parkingLot = this.data.parkingLots[e.detail.value];
    this.setData({
      parkingLot: parkingLot,
      svgUrl: parkingLot.planeGraph
    })
    this.fetchFloorArea();
  },
  fetchFloorArea() {
    let params = {
      keyName: "queryAreaByFloor",
      params: {
        floor_id: this.data.parkingLot.floor
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.common.BUSINESS_SQL, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // let parkingLotNames = res.data.hyz_result.list.map(p => p.name);
          if (res.data.hyz_result.totalNum > 0) {
            this.setData({
              areas: res.data.hyz_result.list,
              parkingArea: res.data.hyz_result.list[0],
              spinShow: false,
              selectType: "area",
              parkingPlace: null
            })
            this.drawArea();
            // for (var i = 0; i < res.data.hyz_result.list.length; i++) {
            //   this.drawArea(res.data.hyz_result.list[i]);
            // }
          }
        }
      }
    })
  },
  areaSelect(e) {
    let bindex = e.currentTarget.dataset.bindex;
    let item = e.currentTarget.dataset.item;
    this.setData({
      parkingArea: item
    })
    let pointArrStr = item.geo.value;
    let pointArr = JSON.parse(pointArrStr);
    this.moveToPoint(pointArr[0].x, pointArr[0].y);
  },
  placeSelect(e) {
    let bindex = e.currentTarget.dataset.bindex;
    let item = e.currentTarget.dataset.item;
    this.setData({
      parkingPlace: item
    })
    this.moveToPoint(item.point1X, item.point1Y);
  },
  fetchSpace() {
    let params = {
      "searchParas": {
        "conditions": [{
          "name": "areaId",
          "op": "eq",
          "type": "string",
          "value": this.data.parkingArea.id
        }],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.car.SPACE_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          if (res.data.hyz_result.totalNum > 0) {
            this.setData({
              places: res.data.hyz_result.list,
              selectType: "place"
            })
            this.drawPlaces();
          }
        }
      }
    })
  },
  drawArea() {
    this.data.ctx.setGlobalAlpha(0.3);
    // this.data.ctx.drawImage(this.data.parkingLot.planeGraph, 0, 0);
    for (var i = 0; i < this.data.areas.length; i++) {
      let area = this.data.areas[i];
      let pointArrStr = area.geo.value;
      let pointArr = JSON.parse(pointArrStr);
      this.data.ctx.setFillStyle(this.data.colors[i]);
      this.data.ctx.beginPath();
      for (var j = 0; j < pointArr.length; j++) {
        if (j === 0) {
          this.data.ctx.moveTo(pointArr[j].x, pointArr[j].y);
        } else {
          this.data.ctx.lineTo(pointArr[j].x, pointArr[j].y);
        }
      }
      this.data.ctx.fill();
      // this.data.ctx.setFillStyle('#fff');
      // this.data.ctx.fillText(area.name, txtX, txtY);
    }

    this.data.ctx.draw();
    let pointArrStr = this.data.areas[0].geo.value;
    let pointArr = JSON.parse(pointArrStr);
    this.moveToPoint(pointArr[0].x, pointArr[0].y);
  },
  drawPlaces() {
    this.data.ctx.setGlobalAlpha(1);
    // this.data.ctx.drawImage(this.data.parkingLot.planeGraph, 0, 0);
    for (var i = 0; i < this.data.places.length; i++) {
      let place = this.data.places[i];
      this.data.ctx.setFillStyle(this.data.colors[0]);
      this.data.ctx.beginPath();
      this.data.ctx.moveTo(place.point1X, place.point1Y);
      this.data.ctx.lineTo(place.point2X, place.point2Y);
      this.data.ctx.lineTo(place.point3X, place.point3Y);
      this.data.ctx.lineTo(place.point4X, place.point4Y);
      this.data.ctx.fill();

      let carX = (place.point1X + place.point2X + place.point3X + place.point4X) / 4;
      let carY = (place.point1Y + place.point2Y + place.point3Y + place.point4Y) / 4;

      this.data.ctx.setFontSize(20);
      this.data.ctx.setFillStyle('#fff');
      this.data.ctx.fillText("_____"+place.label, carX, carY);
    }

    this.data.ctx.draw();
  },
  moveToPoint(x, y) {
    // let centerX = -150 - pointArr[0].x * this.data.scale,
    //   centerY = -100 - pointArr[0].y * this.data.scale;
    let centerX = 150 - x,
      centerY = 200 - y;
    console.log(centerX + ' -- center -- ' + centerY)
    this.setData({
      x: centerX,
      y: centerY
    });
  },
  canvasTap(e) {
    console.log("hit e: ", e);
    // if (e.region) {
    //   console.log("hit region: " + e.region);
    // }
  },
  onScale(event){
    // event.detail = { x, y, scale }
    // console.log("scale", event);
    let scale = event.detail.scale;
    console.log("scale", scale);
    // this.data.ctx.scale(scale, scale);
  },
  zoomMax() {
    let scale = this.data.scale;
    if (scale > 4) {
      scale = 5;
    } else {
      scale = scale + 1;
    }
    this.setData({
      scale: scale
    })
  },
  zoomMin() {
    let scale = this.data.scale;
    if (scale < 2) {
      scale = 2;
    } else {
      scale = scale - 1;
    }
    this.setData({
      scale: scale
    })
    // this.setData({
    //   scale: 0.05
    // })
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