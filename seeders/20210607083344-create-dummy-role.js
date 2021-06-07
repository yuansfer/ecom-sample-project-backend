'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `roles` (`name`) VALUES ('Admin')")
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Role', [{ id: [1] }]);
  }
};