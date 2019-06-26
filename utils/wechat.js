/**
 * @description wehcatAPI
 * @author zza
 * @time 2018-11-19
 */
const Promise = require("./bluebird");
const hyzconst = require('./const.js');
const api = require('./api.js');
const isConsole = true;

/**
 * 获取用户登录
 */
function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject
    })
  })
}

const fetch = function (method, url, params) {

  if (isConsole) {
    console.log("fetch url::: ", url)
    console.log("fetch params::: ", JSON.stringify(params))
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}`,
      data: Object.assign({}, params),
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

const fetchAPI = function (method, url, params) {
  var hyztoken = wx.getStorageSync(hyzconst.AJAX_TOKEN);

  if (isConsole) {
    console.log("--- hyztoken --- ", hyztoken);
    console.log("fetchAPI url::: ", url)
    console.log("fetchAPI params::: ", JSON.stringify(params))
  }

  if (hyztoken) {
    let thisapp = getApp();
    let formids = thisapp.globalData.gloabalFomIds;
    if (formids.length > 0) {
      if (isConsole) {
        console.log("--- hyztoken --- ", hyztoken);
        console.log("fetchAPI url::: ", api.COMMON_API.card.FORMID_LISTADD)
        console.log("fetchAPI params::: ", JSON.stringify(formids))
      }
      wx.request({
        url: api.COMMON_API.card.FORMID_LISTADD,
        data: formids,
        method: 'POST',
        header: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': hyztoken.token_type + ' ' + hyztoken.access_token
        },
        success: function (res) {
          if (isConsole) {
            console.log(api.COMMON_API.card.FORMID_LISTADD, res);
          }
          thisapp.globalData.gloabalFomIds = [];
        }
      })
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${url}`,
        data: params,
        method: method,
        header: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': hyztoken.token_type + ' ' + hyztoken.access_token
        },
        success: function (res) {
          if (isConsole) {
            console.log(url, res);
          }
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  } else {
    console.log('--- no token ---')
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (data) {
          console.log('--- wx.login ---data')
          console.log(data)
          console.log('--- wx.request ---' + api.COMMON_API.common.WECHAT_LOGIN)
          wx.request({
            url: api.COMMON_API.common.WECHAT_LOGIN,
            data: Object.assign({}, {
              'code': data.code
            }),
            method: 'POST',
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              if (res.data.hyz_code === 20000) {
                wx.setStorageSync(hyzconst.AJAX_TOKEN, res.data.hyz_result.token);
                wx.request({
                  url: `${url}`,
                  data: Object.assign({}, params),
                  method: method,
                  header: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': res.data.hyz_result.token.token_type + ' ' + res.data.hyz_result.token.access_token
                  },
                  success: function (res) {
                    resolve(res)
                  },
                  fail: function (err) {
                    reject(err)
                  }
                })
              }
            }
          })
        }
      })
    })
  }
}

/**
 * 应用内跳转页面
 */
function navigatorTo(url) {
  return new Promise((resolve, reject) => {
    wx.navigateTo({
      url: url,
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 重定向到一个页面
 */
function redirectTo(url) {
  return new Promise((resolve, reject) => {
    wx.redirectTo({
      url: url,
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 跳转到tabBar页面，关闭其他页面
 */
function switchTab(url) {
  return new Promise((resolve, reject) => {
    wx.switchTab({
      url: url,
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 获取用户授权设置
 */
function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 获取用户信息
 */
function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 设置缓存
 */
function setStorage(key, value) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: value,
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 获取缓存
 */
function getStorage(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 清理缓存
 */
function clearStorage(key) {
  return new Promise((resolve, reject) => {
    wx.clearStorage({
      key: key,
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 获取用户位置
 */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 动态设置title
 */
function setNavigatorTitle(title) {
  return new Promise((resolve, reject) => {
    wx.setNavigationBarTitle({
      title: title,
      success: resolve
    })
  })
}
/**
 * 打开内置地图
 */
function openLoc(wd, jd, scale, name) {
  return new Promise((resolve, reject) => {
    wx.openLocation({
      latitude: wd, // 纬度，范围为-90~90，负数表示南纬
      longitude: jd, // 经度，范围为-180~180，负数表示西经
      scale: scale, // 缩放比例
      name: name, // 位置名
      // address: 'address', // 地址的详细说明
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 扫描二维码
 */
function scanCode() {
  return new Promise((resolve, reject) => {
    wx.scanCode({
      success: resolve,
      fail: reject
    })
  })
}
module.exports = {
  login: login,
  fetch: fetch,
  fetchAPI: fetchAPI,
  navigatorTo: navigatorTo,
  redirectTo: redirectTo,
  switchTab: switchTab,
  getSetting: getSetting,
  getUserInfo: getUserInfo,
  setStorage: setStorage,
  getStorage: getStorage,
  clearStorage: clearStorage,
  getUserLocation: getUserLocation,
  setNavigatorTitle: setNavigatorTitle,
  openLoc: openLoc,
  scanCode: scanCode
}