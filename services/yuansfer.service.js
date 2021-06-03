require('dotenv').config()
const yuansfer = require('../utils/Yuansfer-js-sdk');

/* To Initilize yuansfer Service Object */
const _init = async () => await yuansfer.init({
    merchantNo: process.env.MERCHANT_NO,
    storeNo: process.env.STORE_NO,
    token: process.env.TOKEN,
    isvFlag: 0,
    env: process.env.ENVIRONMENT
})

/* For One Time Payment */
const _securePay = async data => await yuansfer.securePay(data)

/* Generate Refund Request */
const _refund = async data => await yuansfer.refund(data)

/* Recurring Authorize */
const _autoDebitConsult = async data => await yuansfer.autoDebitConsult(data)

/* Recurring Apply Token */
const _autoDebitApplyToken = async data => await yuansfer.autoDebitApplyToken(data)

/* Recurring Pay (Auto Debit Pay) */
const _autoDebitPay = async data => await yuansfer.autoDebitPay(data)

/* Recurring Pay (Revoke) */
const _autoDebitRevoke = async data => await yuansfer.autoDebitRevoke(data)

const _responseCode = {
    SUCCESS: '000100'
}

const _grantType = {
    AUTHORIZATION_CODE: 'AUTHORIZATION_CODE',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
}

module.exports = {
    _init,
    _securePay,
    _refund,
    _autoDebitConsult,
    _autoDebitApplyToken,
    _autoDebitPay,
    _autoDebitRevoke,
    _responseCode,
    _grantType,
}