'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `roles` (`name`) VALUES ('Admin')")
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Role', [{ id: [1] }]);
  }
};