// pages/notice/info/info.js
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
    noticefrom: "物业管理",
    region: "天德大厦1号楼",
    content: "本周将进行线路保养，周六晚上12点断电一小时。请各单位自行安排工作。",
    remark: "",
    noticeDate: "2019年4月27日",
    noticeId:0
  },

  noticeSubmit: function(e) {
    let formId = e.detail.formId;
    app.dealFormIds(formId);
    wx.redirectTo({
      url: "../../welcome/welcome?from=noticeinfo",
      success: function(res) {
        console.log("跳转成功:" + JSON.stringify(res));
      }
    });
  },
  getNotice() {
    app.wechat.fetchAPI('GET', app.api.COMMON_API.card.ANNOUNCEMENT_GET+this.data.noticeId).then(res => {
      // {
      //   "hyz_code": 20000,
      //     "hyz_message": "服务调用成功",
      //       "hyz_result": {
      //     "id": "8aaaf2486a4fb69a016a4fbc125a0002",
      //       "userId": 5881,
      //         "personName": "扉页",
      //           "informationSource": "物业公司",
      //             "location": "808大院",
      //               "content": "烧烤活动",
      //                 "description": "找秘书报名",
      //                   "releaseTime": "2019-04-24 22:24:46",
      //                     "createTime": "2019-04-24 22:24:46",
      //                       "updateTime": "2019-04-24 22:24:46"
      //   }
      // }
      if (res.data.hyz_code === 20000) {
        this.setData({
          noticefrom: res.data.hyz_result.informationSource,
          region: res.data.hyz_result.location,
          content: res.data.hyz_result.content,
          remark: res.data.hyz_result.description,
          noticeDate: res.data.hyz_result.releaseTime
        })
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
    // console.log("options", options);
    let noticeId = options.id;
    // noticeId = "8aaaf2486a4fb69a016a4fbc125a0002";
    if (noticeId){
      this.setData({
        noticeId: noticeId
      })
      this.getNotice();
    }
  }
})