/**
 * @description 工具函数 请求url
 * @author zza
 * @time 2018-11-19
 */

const API_BASE = 'https://turbo.linkme8.cn:33000/api';
const API_VERSION = '/v1';
const QRCODE_DOMAIN = 'http://turbo.linkme8.cn/tiande/';

const COMMON_API = {
  common: {
    QRCODE_DOMAIN: QRCODE_DOMAIN,

    WECHAT_LOGIN: API_BASE + "/account" + API_VERSION + "/user/wechatLogin",
    USER_INFO: API_BASE + "/account" + API_VERSION + "/user/",
    USER_UPDATE: API_BASE + "/account" + API_VERSION + "/user",
    USER_CURRENT: API_BASE + "/account" + API_VERSION + "/user/current",
    API_TICKET: API_BASE + "/account" + API_VERSION + "/user/getApiTicket",
    ORGANIZATION_LIST: API_BASE + "/account" + API_VERSION + "/organization/list",
    ORGANIZATION: API_BASE + "/account" + API_VERSION + "/organization",
    ORGANIZATION_PID: API_BASE + "/account" + API_VERSION + "/organization/getRootOrganizationByUserId/",
    QRCODE: API_BASE + "/accessControl" + API_VERSION + "/qr/genOpenQR", 
    QRCODE_BYUID: API_BASE + "/accessControl" + API_VERSION + "/qr/genOpenQRByUserId", 

    getQRforSetBuildingNum: API_BASE + "/accessControl" + API_VERSION + "/qr/getQRforSetBuildingNum",
    getQRforSetNetworkConfig: API_BASE + "/accessControl" + API_VERSION + "/qr/getQRforSetNetworkConfig",
    getQRforSetTcpServer: API_BASE + "/accessControl" + API_VERSION + "/qr/getQRforSetTcpServer",
    getQRforSetUdpRecordServer: API_BASE + "/accessControl" + API_VERSION + "/qr/getQRforSetUdpRecordServer",
    getQRforSetUdpServer: API_BASE + "/accessControl" + API_VERSION + "/qr/getQRforSetUdpServer",
    getQRforSetTcpUdpServer: API_BASE + "/accessControl" + API_VERSION + "/qr/getQRforSetTcpUdpServer", 

    BUSINESS_SQL: API_BASE + "/resource" + API_VERSION + "/resource/businessSqls/execBusinessSql",
  },
  car: {
    SVG_ROOT: API_BASE + "/lpgs/upload/",
    SCAN_CODE: API_BASE + "/lpgs/twoDimensionCode/",
    GET_SCAN: API_BASE + "/lpgs/twoDimensionCode/getByUniqueKey",
    FIND_CAR: API_BASE + "/lpgs/parkingSpace/getByLicensePlateNumber/",
    FIND_CAR_TIME: API_BASE + "/lpgs/parkingSpace/getByTime",
    SEARCH_HISTORY: API_BASE + "/lpgs/searchHistory/getMySearchHistory",
    DELETE_HISTORY: API_BASE + "/lpgs/searchHistory/",
    CLEAR_HISTORY: API_BASE + "/lpgs/searchHistory",
    FILE_UPLOAD: API_BASE + "/lpgs/file/upload",

    LOT_LIST: API_BASE + "/lpgs/parkingLot/list",
    SPACE_LIST: API_BASE + "/lpgs/parkingSpace/list",
    SPACE: API_BASE + "/lpgs/parkingSpace", 
  },
  card: {
    CARD_APPLY: API_BASE + "/card/cardApply",
    GET_MY_CARDAPPLY: API_BASE + "/card/cardApply/getMyCardApply",
    CURRENT_USER_CARD: API_BASE + "/account" + API_VERSION + "/card/card",
    USER_CARD: API_BASE + "/account" + API_VERSION + "/card",
    FORMID_LISTADD: API_BASE + "/card/userFormId/listAdd",
    ANNOUNCEMENT_RELEASE: API_BASE + "/card/announcement/release",
    ANNOUNCEMENT_LIST: API_BASE + "/card/announcement/list",
    ANNOUNCEMENT_GET: API_BASE + "/card/announcement/",
    COUPON_LIST: API_BASE + "/card/coupon/list",
    COUPON: API_BASE + "/card/coupon",
    COUPON_TYPE: API_BASE + "/card/couponType",
    COUPON_TYPE_LIST: API_BASE + "/card/couponType/list",
    COUPON_RECEIVE: API_BASE + "/card/coupon/receive",
  },
  visitor: {
    VISITOR: API_BASE + "/account" + API_VERSION + "/visitor",
    VISITOR_LIST: API_BASE + "/account" + API_VERSION + "/visitor/list",
    MY_VISITOR: API_BASE + "/account" + API_VERSION + "/visitor/findVisitorUserByInviter",
    GET_VISITTIME: API_BASE + "/account" + API_VERSION + "/visitor/getVisitorTime/",
  },
  parkinglot: {
    USERCAR_ID: API_BASE + "/parkinglot/userCar/",
    USERCAR_LIST: API_BASE + "/parkinglot/userCar/list",
    USERCAR_MY: API_BASE + "/parkinglot/userCar/getMy/1",
    USERCAR: API_BASE + "/parkinglot/userCar",
    PLACE_GETMY: API_BASE + "/parkinglot/rentStatus/getMyByType/1",
    GETMY_NONUM: API_BASE + "/parkinglot/parkingRecord/getMy",
    GETMY_BYNUM: API_BASE + "/parkinglot/parkingRecord/getByLicensePlateNumber/",
    GETMY_BYGATE: API_BASE + "/parkinglot/parkingRecord/getByGateNumber/",
    RENTRECORD_LIST: API_BASE + "/parkinglot/rentRecord/list",
    RENTRECORD: API_BASE + "/parkinglot/rentRecord",
    RENTRECORD_GETMY: API_BASE + "/parkinglot/rentRecord/getMy",
    GET_TEMPNO: API_BASE + "/parkinglot/parkingRecord/getTempNo",
    PARKINGRECORD_LIST: API_BASE + "/parkinglot/parkingRecord/list",
    PARKINGRECORD: API_BASE + "/parkinglot/parkingRecord",
    OPEN_GATE: API_BASE + "/parkinglot/gate/openGate/",
    GET_RECORD_BYNUM: API_BASE + "/parkinglot/parkingRecord/getByLicensePlateNumber/",
    ACCEPT_SHARE: API_BASE + "/parkinglot/parkingRecord/acceptShare/",
    BIND_COUPON: API_BASE + "/parkinglot/payment/bindCoupon",
    UNBIND_COUPON: API_BASE + "/parkinglot/payment/unbindCoupon",
    RECORD_PAYED: API_BASE + "/parkinglot/parkingRecord/payed",
  },
  payment: {
    ORDER_LIST: API_BASE + "/pay" + API_VERSION + "/pay/payOrders/list",
    ORDER: API_BASE + "/pay" + API_VERSION + "/pay/payOrders",
    APPPAY: API_BASE + "/pay" + API_VERSION + "/pay/wechat/apppay",
    APPPAY_RESULT: API_BASE + "/pay" + API_VERSION + "/pay/wechat/getPayResult",
    INVOICE_LIST: API_BASE + "/pay" + API_VERSION + "/payInvoices/list",
    INVOICE: API_BASE + "/pay" + API_VERSION + "/payInvoices",
  }
}


module.exports = {
  COMMON_API
}