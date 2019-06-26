// pages/carpark/handSearch/handSearch.js
//获取应用实例
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');

Page({
  data: {
    autoplay: false,
    inputindex: 0,
    inputindex2: 0,
    provinces: ["京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀",
      "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂",
      "津", "贵", "云", "桂", "琼", "青", "新", "藏",
      "蒙", "宁", "甘", "陕", "闽", "赣", "湘",
      "港", "澳", "使", "领", "警", "学", "临"
    ],
    numcodes: ["1", "2", "3", "4", "5", "6", "7",
      "8", "9", "0"
    ],
    codes: ["A", "B", "C", "D", "E", "F",
      "G", "H", "J", "K", "L", "M", "N", "P",
      "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-"
    ],
    codes2: ["A", "B", "C", "D", "E", "F",
      "G", "H", "J", "K", "L", "M", "N", "P",
      "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ],
    carNum: {
      // province: '京',
      // first: 'A',
      // nums: ['3', '2', '3', '2', '3'],
      province: '-',
      first: '-',
      nums: ['-', '-', '-', '-', '-'],
      other: '+'
    },
    carNum2: ['-', '-', '-', '-'],
    current: 'num',
    startdate: '',
    starttime: '00:00',
    enddate: '',
    endtime: '00:00',
    historys: [],
    mycars: [],
    // recordInfo:{
    //   licensePlateNumber:"临A12345",
    //   entryTime:"2019-04-16 12:00:00",
    //   entryName:"1号闸机口"
    // },
    recordInfo: null,
    parkGate: ""
  },
  findCar() {
    if (this.data.current === 'num') {
      var carnum = this.data.carNum.province +
        this.data.carNum.first + this.data.carNum.nums.join('');
      if (this.data.carNum.other !== '+') {
        carnum = carnum + this.data.carNum.other;
      }
      if (carnum.indexOf('-') !== -1) {
        $Toast({
          content: '请完整输入车牌号',
          type: 'error'
        });
        return;
      }

      var search_history = wx.getStorageSync(app.hyzconst.SEARCH_HISTORY);
      if (search_history) {
        if (search_history.indexOf(carnum) === -1) {
          search_history.unshift(carnum);
        }
        if (search_history.length > 3) {
          search_history.length = 3;
        }
      } else {
        search_history = [carnum];
      }

      wx.setStorageSync(app.hyzconst.SEARCH_HISTORY, search_history);

      let getestr = "";
      if (this.data.parkGate) {
        getestr = "&gate=" + this.data.parkGate;
      }
      // app.wechat.navigatorTo('../payfee/payfee?carnum=' + carnum + getestr);
      app.wechat.navigatorTo('../result/result?carnum=' + carnum + getestr);
    }
  },
  goBack() {

  },
  onLoad: function(options) {
    console.log("handsearch options:", options);
    // let from = options.from;
    let gate = options.gate;
    // if (from){
    //   console.log("from", from);
    // }
    if (gate) {
      console.log("gate", gate);
      this.setData({
        parkGate: gate
      })
    }
  },
  getMyNonumCar() {
    let hyz_userinfo = app.getHyzUserInfo();
    app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.GETMY_NONUM).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            recordInfo: res.data.hyz_result
          })
        }
      }
    });
  },
  getMyCar() {
    let hyz_userinfo = app.getHyzUserInfo();
    var params = {
      "searchParas": {
        "conditions": [{
          "name": "person",
          "op": "eq",
          "type": "int",
          "value": hyz_userinfo.id
        }],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.parkinglot.USERCAR_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            mycars: res.data.hyz_result.list
          })
        }
      }
    });
  },
  updateHistory() {
    var search_history = wx.getStorageSync(app.hyzconst.SEARCH_HISTORY);
    if (search_history) {
      this.setData({
        historys: search_history
      })
    }
  },
  goPay() {
    let getestr = "";
    if (this.data.parkGate) {
      getestr = "&gate=" + this.data.parkGate;
    }
    app.wechat.navigatorTo('../payfee/payfee?carnum=' + this.data.recordInfo.licensePlateNumber + getestr);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.startPullDownRefresh();
  },
  switchCheckWay({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  btntap: function(e) {
    let inputindex = e.currentTarget.dataset.inputindex;
    this.setData({
      inputindex: parseInt(inputindex)
    })
  },
  btntap2: function(e) {
    let inputindex2 = e.currentTarget.dataset.inputindex2;
    this.setData({
      inputindex2: parseInt(inputindex2)
    })
  },
  mystap(e) {
    let item = e.currentTarget.dataset.item;

    let carnumstr = item.licensePlateNumber;
    let _carNum = {
      province: carnumstr[0],
      first: carnumstr[1],
      nums: [carnumstr[2], carnumstr[3], carnumstr[4], carnumstr[5], carnumstr[6]],
      other: carnumstr[7] ? carnumstr[7] : '+'
    };
    this.setData({
      carNum: _carNum
    })
  },
  historytap(e) {
    let item = e.currentTarget.dataset.item;

    let carnumstr = item;
    let _carNum = {
      province: carnumstr[0],
      first: carnumstr[1],
      nums: [carnumstr[2], carnumstr[3], carnumstr[4], carnumstr[5], carnumstr[6]],
      other: carnumstr[7] ? carnumstr[7] : '+'
    };
    this.setData({
      carNum: _carNum
    })
  },
  codetap: function(e) {
    let item = e.currentTarget.dataset.item;
    if (this.data.inputindex === 0) {
      this.setData({
        ['carNum.province']: item
      })
    } else if (this.data.inputindex === 1) {
      this.setData({
        ['carNum.first']: item
      })
    } else if (this.data.inputindex === 7) {
      if (item === '-') {
        item = '+';
      }
      this.setData({
        ['carNum.other']: item
      })
    } else {
      this.setData({
        ["carNum.nums[" + (this.data.inputindex - 2) + "]"]: item
      })
    }
    var inputindex = this.data.inputindex;
    if (inputindex < 7) {
      this.setData({
        inputindex: inputindex + 1
      })
    }
  },
  codetap2: function(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      ["carNum2[" + (this.data.inputindex2) + "]"]: item
    })

    var inputindex2 = this.data.inputindex2;
    if (inputindex2 < 3) {
      this.setData({
        inputindex2: inputindex2 + 1
      })
    }
  },
  bindStartDateChange: function(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  bindStartTimeChange: function(e) {
    this.setData({
      starttime: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    this.setData({
      enddate: e.detail.value
    })
  },
  bindEndTimeChange: function(e) {
    this.setData({
      endtime: e.detail.value
    })
  },
  onPullDownRefresh: function() {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    this.updateHistory();
    this.getMyCar();
    this.getMyNonumCar();
    $Toast.hide();
    this.stopPullDownRefresh();
  },
  stopPullDownRefresh: function() {
    wx.stopPullDownRefresh({
      complete: function(res) {}
    })
  },
})