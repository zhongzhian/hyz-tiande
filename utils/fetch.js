/**
 * @description 工具函数 发送请求
 * @author zza
 * @time 2018-11-19
 */

const Promise = require('./bluebird.js')
const wechat = require('./wechat.js');

const fetch = function (method, url, params) {
  console.log("fetch url:::" + url)
  console.log("fetch params:::" + JSON.stringify(params))
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}`,
      data: Object.assign({}, params),
      method: method,
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

module.exports = function (method, url, params) {
  // wechat.get
}