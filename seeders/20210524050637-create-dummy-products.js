'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `products` (`id`, `title`, `type`, `price`, `description`, `published`, `created_at`, `updated_at`) VALUES 	(1, 'ElseIf', 'Ethiopian, Light Roast', 25.00, 'The Yirgacheffe Arabica is produced in southern Ethiopia – the birthplace of coffee. Grown at a high elevation and wet-processed, the coffee is known for its markedly mellow, fruity profile and sweet aromas. What it lacks in intensity and weight, it makes up for it in complexity and subtlety of flavors. Perfect for a pour over.', 'yes', '2021-05-12 13:39:18', '2021-05-12 13:39:19'), 	(2, 'Push', 'Peruvian, Medium', 20.00, 'Coffee first made its way to Peru around the 1700s, and the region became one of the first in South America to grow the beans. In fact, to this day, no one knows why or how coffee made its way to Peru before the rest of Central and South America. But throughout the next couple of centuries, coffee production grew and flourished.', 'yes', '2021-05-12 13:39:18', '2021-05-12 13:39:19'), 	(3, 'Join', 'Jamaican Blue, Light', 30.00, 'Blue Mountain Coffee Inc. is one of only a handful of importers in the USA who receives a Certificate of Authenticity with EVERY barrel of Jamaican Blue Mountain coffee that enters our warehouse. This means that every barrel has been tested and passed through the Jamaican Agricultural Commodities Regulatory Authority’s close scrutiny and meets it’s extremely high standards. Our 100% Blue Mountain Coffee is fresh roasted to order and arrives at your doorstep at the peak of freshness. Products ship in one-way valve re-sealable bags.', 'yes', '2021-05-12 13:39:18', '2021-05-12 13:39:19');")
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Product', [{ id: [1, 2, 3, 4] }]);
  }
};