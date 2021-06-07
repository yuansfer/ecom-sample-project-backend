'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `customers` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES 	(1, 'Shreyas', 'Patel', 'ssp', 'sp@email.com', 'ssp', '203018', '302484', NULL, '2021-05-13 11:31:18', '2021-05-13 11:31:22');")
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Customer', [{ name: 'Shreyas' }]);
  }
};