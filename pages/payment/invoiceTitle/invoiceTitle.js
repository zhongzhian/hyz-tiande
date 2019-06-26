// pages/payment/invoiceTitle/invoiceTitle.js
const app = getApp()
const {
  $Toast
} = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceType: "self",
    email: "",
    spinShow: true,
    loading: false,

    bankAccount: "",
    bankName: "",
    companyAddress: "",
    // errMsg: "chooseInvoiceTitle:ok",
    taxNumber: "",
    telephone: "",
    title: "",
    ids: "",
    totalmoney: "1111",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let ids = options.ids;
    let totalmoney = options.money;
    if (ids) {
      this.setData({
        ids: ids,
        totalmoney: totalmoney,
        spinShow: false
      })
    } else {
      // this.setData({
      //   spinShow: true
      // })
    }
  },
  invoiceSubmit() {
    this.setData({
      spinShow: true,
      loading:true
    })
    // bankAccount: res.bankAccount,
    //   bankName: res.bankName,
    //     companyAddress: res.companyAddress,
    //       taxNumber: res.taxNumber,
    //         telephone: res.telephone,
    //           title: res.title,
    let params = {
      "companyAddress": this.data.companyAddress,
      "companyName": this.data.title,
      "companyTel": this.data.telephone,
      "contactEmail": this.data.email,
      "openBank": this.data.bankName,
      "openCardNo": this.data.bankAccount,
      "taxNo": this.data.taxNumber,
      "orderIds": this.data.ids.split(",")
      // "contact": this.data.companyAddress,
      // "contactMobile": this.data.companyAddress,
      // "fileUrl": "string",
      // "status": 0,
      // "taxFile": this.data.companyAddress,
    }
    if (this.data.invoiceType === 'self'){
      params = {
        "companyName": "个人",
        "orderIds": this.data.ids.split(",")
      }
    }
    app.wechat.fetchAPI('POST', app.api.COMMON_API.payment.INVOICE, params).then(res => {
      if (res.data.hyz_code === 20000) {
        if (res.data.hyz_result) {
          //TODO 申请完之后
        }
      }
      this.setData({
        spinShow: false,
        loading: false
      })
    });
  },
  chooseTitle() {
    let that = this;
    wx.chooseInvoiceTitle({
      success(res) {
        console.log("res", res);
        that.setData({
          bankAccount: res.bankAccount,
          bankName: res.bankName,
          companyAddress: res.companyAddress,
          taxNumber: res.taxNumber,
          telephone: res.telephone,
          title: res.title,
        })
      }
    })
  },
  invoiceTypeChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      invoiceType: e.detail.value
    })
  }
})