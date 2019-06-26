// pages/feature/initGate/initGate.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
const QRCode = require('../../../utils/qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: 250,
    imageHeight: 250,
    qrcode: null,
    spinShow: true,
    interval: null,
    errorMsg: "未配置",

    configType: "",
    configTypeIndex: -1,
    configTypes: [{
      name: '设置楼栋编号',
    }, {
      name: '设置网络参数',
    }, {
      name: '设置服务器ip/端口',
    // }, {
      //     name: '设置上传tcp服务器ip/端口',
      //   }, {
      //   name: '设置上传udp记录服务器ip/端口',
      // }, {
      //   name: '设置上传udp服务器ip/端口',
    }],
    showChoose: false,
    showModal: false,
  },

  formSubmit: function(e) {
    let formId = e.detail.formId;
    let formvalue = e.detail.value;
    console.log("formvalue----------------", formvalue);
    app.dealFormIds(formId);

    this.setData({
      spinShow: true
    })

    let params = {};
    let url = "";
    switch (this.data.configTypeIndex) {
      case 0:
        if (!formvalue.buildingNum || !formvalue.projectNum) {
          $Toast({
            content: '请输入所有配置信息',
            type: 'warning'
          });
          return;
        }
        params.buildingNum = formvalue.buildingNum;
        params.projectNum = formvalue.projectNum;
        url = app.api.COMMON_API.common.getQRforSetBuildingNum;
        break;
      case 1:
        if (!formvalue.gateway || !formvalue.ip || !formvalue.netmask || !formvalue.udpPort) {
          $Toast({
            content: '请输入所有配置信息',
            type: 'warning'
          });
          return;
        }
        params.gateway = formvalue.gateway;
        params.ip = formvalue.ip;
        params.netmask = formvalue.netmask;
        // params.newMac = formvalue.newMac;
        // params.oldMac = formvalue.oldMac;
        params.udpPort = formvalue.udpPort;
        url = app.api.COMMON_API.common.getQRforSetNetworkConfig;
        break;
      case 2:
        if (!formvalue.serverIp || !formvalue.serverPort) {
          $Toast({
            content: '请输入所有配置信息',
            type: 'warning'
          });
          return;
        }
        params.serverIp = formvalue.serverIp;
        params.serverPort = formvalue.serverPort;
        url = app.api.COMMON_API.common.getQRforSetTcpUdpServer;
        break;
      // case 2:
      //   if (!formvalue.tcpServerIp || !formvalue.tcpServerPort) {
      //     $Toast({
      //       content: '请输入所有配置信息',
      //       type: 'warning'
      //     });
      //     return;
      //   }
      //   params.tcpServerIp = formvalue.tcpServerIp;
      //   params.tcpServerPort = formvalue.tcpServerPort;
      //   url = app.api.COMMON_API.common.getQRforSetTcpServer;
      //   break;
      // case 3:
      //   if (!formvalue.udpRecordServerIp || !formvalue.udpRecordServerPort) {
      //     $Toast({
      //       content: '请输入所有配置信息',
      //       type: 'warning'
      //     });
      //     return;
      //   }
      //   params.udpRecordServerIp = formvalue.udpRecordServerIp;
      //   params.udpRecordServerPort = formvalue.udpRecordServerPort;
      //   url = app.api.COMMON_API.common.getQRforSetUdpRecordServer;
      //   break;
      // case 4:
      //   if (!formvalue.udpServerIp || !formvalue.udpServerPort) {
      //     $Toast({
      //       content: '请输入所有配置信息',
      //       type: 'warning'
      //     });
      //     return;
      //   }
      //   params.udpServerIp = formvalue.udpServerIp;
      //   params.udpServerPort = formvalue.udpServerPort;
      //   url = app.api.COMMON_API.common.getQRforSetUdpServer;
      //   break;
    }
    this.setData({
      showModal: false
    })
    console.log("params----------------", params);
    if (url) {
      app.wechat.fetchAPI('POST', url, params).then(res => {
        if (res.data.hyz_code === 20000) {
          if (res.data.hyz_result) {
            console.log("二维码::::::::::;", res.data.hyz_result);
            // qrcode.makeCode(timestampStr);
            if (!this.data.qrcode) {
              let qrcode = new QRCode('canvas', {
                text: "code=00000000000",
                width: 250,
                height: 250,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
              });
              this.setData({
                qrcode: qrcode
              })
            }
            this.data.qrcode.makeCode(res.data.hyz_result);
            this.setData({
              spinShow: false,
              // showModal: false,
              errorMsg: ""
            })
          }
        } else {
          // this.setData({
          //   errorMsg: res.data.hyz_message,
          //   spinShow: false
          // })
          $Toast({
            content: res.data.hyz_message,
            type: 'error'
          });
          this.setData({
            spinShow: false
          })
        }

      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    // let _start = res.aaa;
    // this.setData({
    //   msg: _start
    // })
    var that = this;
    var interval = setInterval(function() {
      let hyz_userinfo = app.getHyzUserInfo();
      if (hyz_userinfo) {
        clearInterval(that.data.interval);
      }
    }, 100)

    that.setData({
      interval: interval,
      spinShow: false
    })
  },
  imageLoad: function(e) {
    let imageSize = app.appUtil.imageUtil(e);
    this.setData({
      imageWidth: imageSize.imageWidth,
      imageHeight: imageSize.imageHeight,
    })
  },
  getQrCodeText() {
    let params = {};
    switch (this.data.configTypeIndex) {
      case 0:
        // this.doScan();
        break;
      case 1:
        // this.goErweima();
        break;
      case 2:
        // this.doScan();
        break;
      case 3:
        // this.doScan();
        break;
      case 4:
        // this.doScan();
        break;
    }
    app.wechat.fetchAPI('POST', app.api.COMMON_API.common.QRCODE, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          // var timestampStr = new Date().getTime() + "";
          // timestampStr = timestampStr + Math.random(10000000);
          console.log("二维码::::::::::;", res.data.hyz_result);
          // qrcode.makeCode(timestampStr);
          if (!this.data.qrcode) {
            let qrcode = new QRCode('canvas', {
              text: "code=00000000000",
              width: 250,
              height: 250,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H,
            });
            this.setData({
              qrcode: qrcode
            })
          }
          this.data.qrcode.makeCode(res.data.hyz_result);
          this.setData({
            spinShow: false
          })
        }
      } else {
        this.setData({
          errorMsg: res.data.hyz_message,
          spinShow: false
        })
      }
    });
  },
  choose() {
    this.setData({
      showChoose: true
    })
  },
  chooseConfig({
    detail
  }) {
    const index = detail.index;
    let configType = this.data.configTypes[index].name;

    this.setData({
      configTypeIndex: index,
      configType: configType,
      showChoose: false,
      showModal: true
    });
  },
  cancelConfig() {
    this.setData({
      showChoose: false
    });
  },
})