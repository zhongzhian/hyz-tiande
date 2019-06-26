// pages/card/apply.js
const app = getApp();
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    name: "",
    phone: "",
    idcard: "",
    organizations: [],
    companys: [],
    depts: [],
    companyNames: [],
    deptNames: [],
    selectCompany: null,
    selectDept: null,
    applyComId:0,
    applyComName:"",
    myFormat: ['时', '分', '秒'],
    status: '进行中...',
    clearTimer: false,
    isAgain: false,
    cardStatus: 0,
    myApplys: null,
    showTips: false,
    tipActions: [{
      name: '返回',
      color: '#2d8cf0',
    }],
    msg:'111',
    msg2: '222',
    spinShow: true,
    interval: null
  },
  tipClick({
    detail
  }) {
    const index = detail.index;
    if (index === 0) {
      wx.redirectTo({
        url: "../welcome/welcome?from=cardapply",
        success: function (res) {
          console.log("跳转成功:" + JSON.stringify(res));
        }
      });
      this.setData({
        showTips: false
      });
    }
  },
  againSubmit: function (e) {
    let formId = e.detail.formId;
    $Toast({
      content: '提交中',
      type: 'loading'
    });
    let params = this.data.myApplys;
    params.formId = formId;
    app.wechat.fetchAPI('PUT', app.api.COMMON_API.card.CARD_APPLY, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            showTips: true,
            myApplys: res.data.hyz_result
          });
        } else {
          $Toast({
            content: '提交申请失败',
            type: 'warning'
          });
        }
      }
      $Toast.hide();
    });
  },
  formSubmit: function(e) {
    let formId = e.detail.formId;
    let formvalue = e.detail.value;
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    // cardType(integer, optional): 卡类型 - 审核的时候填入，1：物业管理卡，2：物业员工卡，3：公司管理卡，4：公司员工卡，5：临时访客卡,
    //   formId(integer, optional): 每次申请的唯一ID 7天有效,
    //     idNumber(string, optional): 身份证号,
    //       organizationId(integer, optional): 用户归属组织ID,
    //         organizationName(string, optional): 用户归属组织名称,
    //           status(integer, optional): 状态：0 - 审批中 1 - 审批通过 2 - 审批不通过,
    //             suggestion(string, optional): 审核意见,
    //               telphone(string, optional): 用户联系电话,
    //                 userId(integer, optional): 申请人ID,
    //                   userName(string, optional): 申请人姓名

    if (!this.data.selectDept) {
      $Toast({
        content: '请选择所属单位和部门',
        type: 'warning'
      });
      return;
    }
    if (!formvalue.userName) {
      $Toast({
        content: '请输入姓名',
        type: 'warning'
      });
      return;
    }
    if (!formvalue.idcard) {
      $Toast({
        content: '请输入身份证号',
        type: 'warning'
      });
      return;
    }
    if (!formvalue.phone) {
      $Toast({
        content: '请输入电话',
        type: 'warning'
      });
      return;
    }

    let params = {
      "formId": formId,
      "idNumber": formvalue.idcard,
      "organizationId": this.data.selectDept.id,
      "organizationName": this.data.selectDept.organizationName,
      "status": 0,
      "telphone": formvalue.phone,
      "userName": formvalue.userName
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.CARD_APPLY, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          this.setData({
            showTips: true,
            myApplys: res.data.hyz_result
          });
        } else {
          $Toast({
            content: '提交申请失败',
            type: 'warning'
          });
        }
      }
      $Toast.hide();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var interval = setInterval(function () {
      let ajaxtoken = wx.getStorageSync(app.hyzconst.AJAX_TOKEN);
      if (ajaxtoken) {
        clearInterval(that.data.interval);
        that.getOrganization();
      }
    }, 100)

    that.setData({
      interval: interval
    })
  },
  getMyApply() {
    let cardStatus = 0;
    app.wechat.fetchAPI('GET', app.api.COMMON_API.card.GET_MY_CARDAPPLY).then(res => {
      // {
      //   "hyz_code": 20000,
      //     "hyz_message": "服务调用成功",
      //     "hyz_result": {
      //     "id": 2076,
      //       "userId": 1332,
      //         "formId": "9c17bc56f992437b817869ccc69f068b",
      //           "userName": "哈哈哈哈",
      //             "organizationId": 388,
      //               "organizationName": "我试试",
      //                 "telphone": "6666",
      //                   "idNumber": "55555",
      //                     "roleIds": null,
      //                       "status": 0,
      //                         "createTime": "2019-04-09 20:54:34",
      //                           "updateTime": "2019-04-09 20:54:34"
      //   }
      // }
      if (res.data.hyz_code === 20000) {
        let _applyComId = 0, _applyComName = "";
        for (var i = 0; i < this.data.organizations.length; i++) {
          if (this.data.organizations[i].id === res.data.hyz_result.organizationId) {
            _applyComId = this.data.organizations[i].parentId;
            break;
          }
        }
        for (var i = 0; i < this.data.companys.length; i++) {
          if (this.data.companys[i].id === _applyComId) {
            _applyComName = this.data.companys[i].organizationName;
            break;
          }
        }
        //TODO status (integer, optional): 状态：0-审批中 1-审批通过 2-审批不通过 ,
        cardStatus = 2;
        if (res.data.hyz_result.status === 1){
          cardStatus = 1;
        }
        
        this.setData({
          myApplys: res.data.hyz_result,
          applyComId: _applyComId,
          applyComName: _applyComName,
          // msg2: JSON.stringify(res.data.hyz_result),
          isAgain: true,
          spinShow: false,
          cardStatus: cardStatus
        })
      } else {
        this.setData({
          spinShow: false,
          cardStatus: cardStatus
        })
      }
      // $Toast.hide();
    });
  },
  getOrganization() {
    // $Toast({
    //   content: '加载中',
    //   type: 'loading'
    // });
    let params = {};
    app.wechat.fetchAPI('POST', app.api.COMMON_API.common.ORGANIZATION_LIST, params).then(res => {
      // {"hyz_code": 20000,
      //   "hyz_message": "服务调用成功",
      //     "hyz_result": {
      //   "totalNum": 9,
      //     "list": [{
      //               "id": 387,
      //                 "parentId": 0,
      //                   "organizationType": "1",
      //                     "organizationCode": "001",
      //                       "organizationName": "物业公司",
      //                         "level": 1,
      //                           "remark": "这是物业公司",
      //                             "createTime": "2019-04-01 21:23:06",
      //                               "updateTime": "2019-04-01 21:23:06"
      //             }]
      //     }}
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result.list) {
          var _companys = [],
            _companyNames = [];
          for (var i = 0; i < res.data.hyz_result.list.length; i++) {
            if (res.data.hyz_result.list[i].parentId === 0) {
              _companys.push(res.data.hyz_result.list[i]);
              _companyNames.push(res.data.hyz_result.list[i].organizationName);
            }
          }
          this.setData({
            organizations: res.data.hyz_result.list,
            companys: _companys,
            companyNames: _companyNames,
            deptNames: [],
            depts: [],
            selectCompany: null,
            selectDept: null
          })
          this.getMyApply();
        } else {}
      }
    });
  },
  bindCompanyChange: function(e) {
    let _selectCompany = this.data.companys[e.detail.value];
    let _depts = [],
      _deptNames = [];
    for (var i = 0; i < this.data.organizations.length; i++) {
      if (this.data.organizations[i].parentId === _selectCompany.id) {
        _depts.push(this.data.organizations[i]);
        _deptNames.push(this.data.organizations[i].organizationName);
      }
    }
    this.setData({
      selectCompany: _selectCompany,
      depts: _depts,
      deptNames: _deptNames
    })
  },
  bindDeptChange: function(e) {
    let _selectDept = this.data.depts[e.detail.value];
    this.setData({
      selectDept: _selectDept
    })
  },
  myLinsterner(e) {
    this.setData({
      // clearTimer: true,
      status: '结束'
    });
  },
  getCode() {
    this.setData({
      targetTime: new Date().getTime() + 60000
    });
  },
  backToHome() {
    wx.redirectTo({
      url: "../welcome/welcome?from=cardapply",
      success: function (res) {
        console.log("跳转成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("跳转失败:" + JSON.stringify(res));
      },
      complete: function (res) {
        console.log("跳转complete:" + JSON.stringify(res));
      }
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      clearTimer: true
    });
  }
})