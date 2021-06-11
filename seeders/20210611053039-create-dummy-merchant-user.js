'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    // MERCHANT-USER
    return queryInterface.sequelize.query("INSERT INTO `users` VALUES (1, NULL, NULL, 'merchant', 'Alex', 'Smith', 'merchant@yuansfer.com', 'merchant@yuansfer.com', '$2b$10$058Il2F9yiVA850qq1OR8.S0OrkGPEmRuipOWXDoqQ0ZHeyzjCEF2', 'active',NOW(),NOW())")
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', [{ username: 'merchant@yuansfer.com' }])
  }
};