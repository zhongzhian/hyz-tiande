// pages/mine/car/car.js
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
    // nonumcar:{
    //   carnum:"临A12345",
    //   intime:"2019-04-16 12:00:00",
    //   parkGate:"1号闸机口"
    // },
    nonumcar: null,
    carid: 0,
    carobj: null
  },
  saveCar() {
    var carnum = this.data.carNum.province +
      this.data.carNum.first + this.data.carNum.nums.join('');
    if (this.data.carNum.other !== '+') {
      carnum = carnum + this.data.carNum.other;
    }
    console.log('--- carnum ---' + carnum);
    if (carnum.indexOf('-') !== -1) {
      $Toast({
        content: '请完整输入车牌号',
        type: 'error'
      });
      return;
    }
    let params = null
    if (this.data.carobj){
      params = this.data.carobj;
      params.licensePlateNumber = carnum;
    } else {
      let hyz_userinfo = app.getHyzUserInfo();
      let company = app.getHyzUserCompany();
      params = {
        "company": company.id,
        "companyName": company.name,
        "licensePlateNumber": carnum,
        "person": hyz_userinfo.id,
        "personName": hyz_userinfo.personName,
        "type": "1",
        "typeName": "用户车辆 "
      };
    }

    app.wechat.fetchAPI('POST', app.api.COMMON_API.parkinglot.USERCAR, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          $Toast({
            content: '保存成功',
            type: 'success'
          });
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000);
        }
      }
    });
  },
  onLoad: function(options) {
    console.log('--- car onLoad ---');
    console.log('options', options);
    let id = options.id;
    if (id) {
      app.wechat.fetchAPI('GET', app.api.COMMON_API.parkinglot.USERCAR_ID + id).then(res => {
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            let carnumstr = res.data.hyz_result.licensePlateNumber;
            let _carNum = {
              province: carnumstr[0],
              first: carnumstr[1],
              nums: [carnumstr[2], carnumstr[3], carnumstr[4], carnumstr[5], carnumstr[6]],
              other: carnumstr[7] ? carnumstr[7] : '+'
            };
            this.setData({
              carobj: res.data.hyz_result,
              carid: id,
              carNum: _carNum
            })
          }
        }
      });
    }
  },
  btntap: function(e) {
    let inputindex = e.currentTarget.dataset.inputindex;
    this.setData({
      inputindex: parseInt(inputindex)
    })
    console.log('this.data.inputindex:::' + this.data.inputindex)
  },
  btntap2: function(e) {
    let inputindex2 = e.currentTarget.dataset.inputindex2;
    this.setData({
      inputindex2: parseInt(inputindex2)
    })
    console.log('this.data.inputindex2:::' + this.data.inputindex2)
  },
  codetap: function(e) {
    let item = e.currentTarget.dataset.item;
    console.log('item:::' + item)
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
    console.log('item:::' + item)
    this.setData({
      ["carNum2[" + (this.data.inputindex2) + "]"]: item
    })

    var inputindex2 = this.data.inputindex2;
    if (inputindex2 < 3) {
      this.setData({
        inputindex2: inputindex2 + 1
      })
    }
    console.log(this.data.carNum2);
  },
})