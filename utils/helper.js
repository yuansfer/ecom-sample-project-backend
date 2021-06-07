const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const util = require('util')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const passportConfig = require('../config/passport.config');

const _fullDateFormatOfMoment = 'YYYY-MM-DD HH:mm:ss.SSS'

const _compareDate = (dateTime1, dateTime2) => moment(dateTime1, _fullDateFormatOfMoment) >= moment(dateTime2, _fullDateFormatOfMoment)

const _uuid = () => uuidv4()

const _referenceNo = () => 'REFERENCE#' + new Date().getTime()

const _getError = (error) => {
    let message = error;
    if (error instanceof Error || error instanceof TypeError) {
        message = error.message;
    } else if (['SequelizeDatabaseError', 'SequelizeUniqueConstraintError'].includes(error.name)) {
        message = error.original.sqlMessage;
    } else if (error.name === 'SequelizeValidationError') {
        message = error.errors[0].message;
    } else if (error.ret_msg) {
        message = error.ret_msg;
    }
    return message;
}

const _extractObject = (obj) => {
    const _obj = util.inspect(obj, { showHidden: false, depth: null, colors: true })
    return _obj;
};


const _generateToken = async (payload) => {
    return await jwt.sign(payload, passportConfig.SECRET_KEY, {
        expiresIn: passportConfig.TOKEN_LIFE
        //issuer: process.env.ROOT_URL
    });
}

const _generateHasPassword = async (password) => bcrypt.hashSync(password, passportConfig.SALT_ROUNDS)

module.exports = {
    _getError,
    _uuid,
    _compareDate,
    _referenceNo,
    _extractObject,
    _generateToken,
    _generateHasPassword
}