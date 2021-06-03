let cn = require('../crons/cron');

const cronSchedule = () => {
    cn.autoDebitPay();
};

module.exports = {
    cronSchedule
}