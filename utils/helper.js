const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const util = require('util')

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

module.exports = {
    _getError,
    _uuid,
    _compareDate,
    _referenceNo,
    _extractObject,
}