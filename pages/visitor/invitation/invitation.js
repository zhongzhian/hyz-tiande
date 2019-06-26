// pages/home/visitor/invitation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.114510,
    longitude: 113.332861,
    markers: [{
      latitude: 23.114510,
      longitude: 113.332861,
      name: '天德广场'
    }],
    showLocation: true,
    phone: "",
    code: "",
    invitation: null,
    inviteStatus: 1, // inviteStatus:被邀请人状态，1是未绑定过手机号，2是绑定过且有邀请函，3是绑定过但没有邀请函
    spinShow: true,
    interval: null,
    inviteId: 0,
    invitor: null,
    company: "",
    visitorTime: "",
    visitorStartTime: "",
    visitorEndTime: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    let _inviteId = res.inviteId;
    // _inviteId = 38331;
    this.setData({
      inviteId: _inviteId
    })
    var that = this;
    var interval = setInterval(function() {
      let hyz_userinfo = app.getHyzUserInfo();
      if (hyz_userinfo) {
        clearInterval(that.data.interval);
        that.checkInvite();
      }
    }, 100)

    that.setData({
      interval: interval
    })
  },
  checkInvite() {
    let hyz_userinfo = app.getHyzUserInfo();
    console.log("邀请函 inviteId", this.data.inviteId);
    // if (hyz_userinfo){

    // }else{

    // }
    var params = {
      "searchParas": {
        "conditions": [{
            "name": "userId",
            "op": "eq",
            "type": "int",
            "value": hyz_userinfo.id
          },
          // {
          //   "name": "visitorStatus",
          //   "op": "noeq",
          //   "type": "int",
          //   "value": 2
          // },
          // {
          //   "name": "visitorStatus",
          //   "op": "noeq",
          //   "type": "int",
          //   "value": 3
          // },
          {
            "name": "id",
            "op": "eq",
            "type": "int",
            "value": this.data.inviteId
          }
        ],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.visitor.VISITOR_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          if (res.data.hyz_result.list.length > 0) {
            // 绑定过有邀请函
            this.setData({
              invitation: res.data.hyz_result.list[0],
              inviteStatus: 2,
              spinShow: false
            });
            this.setInvitor();
          } else {
            if (hyz_userinfo.telphone != null && hyz_userinfo.telphone != undefined && hyz_userinfo.telphone != "") {
              // 绑定过但无邀请函
              this.setData({
                inviteStatus: 3,
                spinShow: false
              });
            } else {
              // 未绑定过
              this.setData({
                inviteStatus: 1,
                spinShow: false
              });
            }
          }
        }
      }
    })
  },
  confirmInvite(e) {
    let formId = e.detail.formId;
    let formvalue = e.detail.value;
    let hyz_userinfo = app.getHyzUserInfo();

    this.setData({
      phone: formvalue.phone,
      code: formvalue.code,
    });

    var params = {
      "searchParas": {
        "conditions": [{
            "name": "telphone",
            "op": "eq",
            "type": "string",
            "value": this.data.phone
          },
          // {
          //   "name": "visitorStatus",
          //   "op": "noeq",
          //   "type": "int",
          //   "value": 2
          // },
          // {
          //   "name": "visitorStatus",
          //   "op": "noeq",
          //   "type": "int",
          //   "value": 3
          // },
          {
            "name": "id",
            "op": "eq",
            "type": "int",
            "value": this.data.inviteId
          }
        ],
        "logic": "and"
      }
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.visitor.VISITOR_LIST, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          if (res.data.hyz_result.list.length > 0) {
            // 绑定过有邀请函
            let _visitor = res.data.hyz_result.list[0];
            console.log("_visitor", _visitor);
            _visitor.visitorStatus = 1;
            _visitor.userId = hyz_userinfo.id;
            console.log("_visitor", _visitor);

            // 更新邀请函状态，只有第一次需要更新
            app.wechat.fetchAPI('PUT', app.api.COMMON_API.visitor.VISITOR, _visitor).then(res => {
              if (res.data.hyz_code === 20000) {
                this.setData({
                  invitation: _visitor,
                  inviteStatus: 2
                });
                this.setInvitor();
              }
            })

            // 绑定手机号到用户
            hyz_userinfo.telphone = _visitor.telphone;
            hyz_userinfo.personName = _visitor.visitorName;
            if (hyz_userinfo.userType === 9) {
              hyz_userinfo.userType = 8;
            }
            app.wechat.fetchAPI('PUT', app.api.COMMON_API.common.USER_UPDATE, hyz_userinfo).then(res => {
              if (res.data.hyz_code === 20000) {
                // wx.setStorageSync(this.hyzconst.AJAX_TOKEN, res.data.hyz_result);
              }
            })
          } else {
            // 绑定过但无邀请函
            this.setData({
              inviteStatus: 3
            });
          }
        }
      }
    })
  },
  setInvitor() {
    let visitorTime = this.data.invitation.visitorStartTime.split(" ")[0];
    let visitorStartTime = this.data.invitation.visitorStartTime.split(" ")[1];
    let visitorEndTime = this.data.invitation.visitorEndTime.split(" ")[1];
    this.setData({
      visitorTime: visitorTime,
      visitorStartTime: visitorStartTime,
      visitorEndTime: visitorEndTime
    })

    app.wechat.fetchAPI('GET', app.api.COMMON_API.common.USER_INFO + this.data.invitation.inviterId).then(res => {
      // {
      //   "hyz_code": 20000,
      //     "hyz_message": "服务调用成功",
      //       "hyz_result": {
      //     "id": 2065,
      //       "hasface": 0,
      //         "contractId": "testtest",
      //           "createTime": "2019-04-09 20:42:19",
      //             "loginTime": "2019-04-09 20:42:19",
      //               "lastLoginTime": "2019-04-09 20:42:19",
      //                 "updateTime": "2019-04-10 16:32:36",
      //                   "userSkillVos": null,
      //                     "roleList": [],
      //                       "organizationName": null,
      //                         "departmentPositionName": null,
      //                           "cardVo": null
      //   }
      // }

      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            invitor: res.data.hyz_result
          })
          this.getCompany();
        }
      }
    })
  },
  getCompany() {
    if (this.data.invitor.rootOrganization) {
      this.setData({
        company: this.data.invitor.rootOrganization.organizationName
      })
    }
    // if (this.data.invitor.organizationId) {
    //   let params = {};
    //   app.wechat.fetchAPI('POST', app.api.COMMON_API.common.ORGANIZATION_LIST, params).then(res => {
    //     if (res.data.hyz_code === 20000) {
    //       if (res.data.hyz_result.list) {
    //         var _companys = [],
    //           _companyId = 0,
    //           _companyName = "";
    //         for (var i = 0; i < res.data.hyz_result.list.length; i++) {
    //           if (res.data.hyz_result.list[i].parentId === 0) {
    //             _companys.push(res.data.hyz_result.list[i]);
    //           }
    //           if (res.data.hyz_result.list[i].id === hyz_userinfo.organizationId) {
    //             _companyId = res.data.hyz_result.list[i].parentId;
    //           }
    //         }
    //         for (var i = 0; i < _companys.length; i++) {
    //           if (_companys[i].id === _companyId) {
    //             _companyName = _companys[i].organizationName
    //           }
    //         }

    //         this.setData({
    //           company: _companyName
    //         })
    //       }
    //     }
    //   })
    // }
  },
  receiveInvite() {
    wx.redirectTo({
      url: "../../welcome/welcome?aaa=123",
      success: function(res) {
        console.log("跳转成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        console.log("跳转失败:" + JSON.stringify(res));
      },
      complete: function(res) {
        console.log("跳转complete:" + JSON.stringify(res));
      }
    });
  },
  backToHome() {
    wx.redirectTo({
      url: "../../welcome/welcome?aaa=123",
      success: function(res) {
        console.log("跳转成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        console.log("跳转失败:" + JSON.stringify(res));
      },
      complete: function(res) {
        console.log("跳转complete:" + JSON.stringify(res));
      }
    });
  },
  goToTiande() {
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        console.log("res", res);
        const latitude = 23.114510
        const longitude = 113.332861
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("--------------------------invitation onReady");
    // this.checkInvite();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("--------------------------invitation onShow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})