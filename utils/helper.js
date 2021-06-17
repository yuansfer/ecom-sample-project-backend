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
    } else if (['SequelizeDatabaseError', 'SequelizeUniqueConstraintError',].includes(error.name)) {
        message = error.original.sqlMessage;
    } else if (error.name === 'SequelizeCustomError') {
        message = error.errors[0].message;
    } else if (error.name === 'SequelizeValidationError') {
        message = error.errors[0].message;
        //message = error.errors.map(e => e.message);
    } else if (error.ret_msg) {
        message = error.ret_msg;
    }
    //console.log('message', message)
    return message;
}

const _extractObject = (obj) => {
    return util.inspect(obj, { showHidden: false, depth: null, colors: true })
};

const _generateToken = async (payload, mode = null) => {
    if (mode === 'refresh') {
        return await jwt.sign(payload, passportConfig.REFRESH_TOKEN_SECRET, {
            /* set expiresIn when call refreshtoken endpoint */
            //expiresIn: passportConfig.REFRESH_TOKEN_LIFE
            //issuer: process.env.ROOT_URL
        });
    } else {
        return await jwt.sign(payload, passportConfig.TOKEN_SECRET, {
            expiresIn: passportConfig.TOKEN_LIFE
            //issuer: process.env.ROOT_URL
        });
    }
}

const _generateHasPassword = async (password) => bcrypt.hashSync(password, passportConfig.SALT_ROUNDS)

const _extractToken = async (token, mode = null) => await jwt.verify(token, (mode === 'refresh' ? passportConfig.REFRESH_TOKEN_SECRET : passportConfig.TOKEN_SECRET), { expiresIn: (mode === 'refresh' ? passportConfig.REFRESH_TOKEN_LIFE : passportConfig.TOKEN_LIFE) });

module.exports = {
    _getError,
    _uuid,
    _compareDate,
    _referenceNo,
    _extractObject,
    _generateToken,
    _extractToken,
    _generateHasPassword,
}