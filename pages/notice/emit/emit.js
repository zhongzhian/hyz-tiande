// pages/notice/emit/emit.js
const app = getApp();
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: null,
    region: "",
    content: "",
    remark: "",
    noticeDate: "",
    company: ""
  },

  noticeSubmit: function(e) {
    let formId = e.detail.formId;
    app.dealFormIds(formId);

    let formvalue = e.detail.value;
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    console.log("this.data.content", formvalue.content)
    if (!formvalue.content) {
      $Toast({
        content: '请输入内容',
        type: 'warning'
      });
      return;
    }
    // return;
    let hyz_userinfo = app.getHyzUserInfo();
    let params = {
      "content": formvalue.content,
      "description": formvalue.remark,
      "location": formvalue.region
    };
    app.wechat.fetchAPI('POST', app.api.COMMON_API.card.ANNOUNCEMENT_RELEASE, params).then(res => {
      if (res.data.hyz_code === 20000) {

      }
    })
  },
  getOrganization() {
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
  bindDateChange: function(e) {
    this.setData({
      noticeDate: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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