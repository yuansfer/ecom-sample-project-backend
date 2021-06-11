'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    // CUSTOMER-USER
    return queryInterface.sequelize.query("INSERT INTO `users` VALUES (2, 1, NULL, 'customer', 'Shreyas', 'Patel', 'customer@yuansfer.com', 'customer@yuansfer.com', '$2b$10$058Il2F9yiVA850qq1OR8.S0OrkGPEmRuipOWXDoqQ0ZHeyzjCEF2', 'active',NOW(),NOW())")
      .then(() => {

        // CUSTOMER
        let sql = "INSERT INTO `customers` VALUES (1, 'Shreyas', 'Patel',NOW(),NOW())";
        queryInterface.sequelize.query(sql)
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', [{ user_type: 'customer', username: 'customer@yuansfer.com' }])
      .then(() => {
        return queryInterface.bulkDelete('Customer', [{ id: '1', name: 'Shreyas' }])
      })
  }
};