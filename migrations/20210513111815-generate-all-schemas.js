'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // USERS
    let sql = "CREATE TABLE IF NOT EXISTS `users` (`id` int(11) NOT NULL AUTO_INCREMENT,`customer_id` INT(11) NULL DEFAULT NULL, `role_id` int(11) DEFAULT NULL,`user_type` enum('customer','merchant') CHARACTER SET utf8 DEFAULT NULL,`firstname` varchar(255) CHARACTER SET utf8 NOT NULL,`lastname` varchar(255) CHARACTER SET utf8 DEFAULT NULL,`username` varchar(255) CHARACTER SET utf8 NOT NULL,`email` varchar(255) CHARACTER SET utf8 NOT NULL,`password` varchar(255) CHARACTER SET utf8 NOT NULL,`status` enum('active','inactive') CHARACTER SET utf8 DEFAULT 'active',`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`),UNIQUE KEY `username` (`username`), UNIQUE KEY `email` (`email`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    return await queryInterface.sequelize.query(sql)
      .then(async () => {

        // CUSTOMERS
        let sql = "CREATE TABLE `customers` (`id` INT(11) NOT NULL AUTO_INCREMENT,`firstname` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`lastname` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB DEFAULT CHARSET=utf8";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // PRODUCTS
        let sql = "CREATE TABLE IF NOT EXISTS `products` (`id` int(11) NOT NULL AUTO_INCREMENT,`title` varchar(255) CHARACTER SET utf8 NOT NULL,`type` varchar(255) CHARACTER SET utf8 DEFAULT NULL,`price` decimal(10,2) NOT NULL,`description` text CHARACTER SET utf8,`published` enum('yes','no') CHARACTER SET utf8 DEFAULT 'yes',`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // CARTS
        let sql = "CREATE TABLE `carts` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT,`customer_id` INT(11) NULL DEFAULT NULL, `session_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', `shipping_address` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`shipping_city_state` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',`shipping_country` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',`shipping_email` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`shipping_phone` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`) USING BTREE,INDEX `customer_id` (`customer_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB;";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // CART PRODUCTS
        let sql = "CREATE TABLE `cart_products` (`id` INT(11) NOT NULL AUTO_INCREMENT,`cart_id` INT(11) NOT NULL,`product_id` INT(11) NOT NULL,`qty` INT(11) NOT NULL,`size` ENUM('small','medium','large') NOT NULL COLLATE 'utf8_general_ci',`purchase_mode` ENUM('buy','subscribe') NOT NULL DEFAULT 'buy' COLLATE 'utf8_general_ci',`subscribe_month` INT(11) NULL DEFAULT NULL,`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`) USING BTREE,INDEX `cart_id` (`cart_id`) USING BTREE,INDEX `product_id` (`product_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB ;";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // ORDERS
        let sql = "CREATE TABLE `orders` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`customer_id` INT(11) NOT NULL, 	`address` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`city_state` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`country` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`email` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`phone` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', `vendor` VARCHAR(25) NOT NULL COLLATE 'utf8_general_ci',	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB ; ";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // ORDER PRODUCTS
        let sql = "CREATE TABLE `order_products` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`order_id` INT(11) NOT NULL, 	`product_id` INT(11) NOT NULL, 	`qty` INT(11) NOT NULL, 	`price` DECIMAL(10,2) NOT NULL, 	`size` ENUM('small','medium','large') NOT NULL COLLATE 'utf8_general_ci', 	`purchase_mode` ENUM('buy','subscribe') NOT NULL DEFAULT 'buy' COLLATE 'utf8_general_ci', 	`subscribe_month` INT(11) NULL DEFAULT NULL, 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `order_id` (`order_id`) USING BTREE, 	INDEX `product_id` (`product_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB;";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // PAYMENTS
        let sql = "CREATE TABLE `payments` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`customer_id` INT(11) NOT NULL, 	`order_id` INT(11) NOT NULL, 	`vendor` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`reference` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`paid_amount` DECIMAL(10,2) NOT NULL, 	`currency` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`settle_currency` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`transaction_no` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`cashier_url` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`success_code` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`success_message` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE, 	INDEX `order_id` (`order_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB;";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // REFUNDS
        let sql = "CREATE TABLE `refunds` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`payment_id` INT(11) NOT NULL, 	`customer_id` INT(11) NOT NULL, 	`order_id` INT(11) NOT NULL, 	`amount` DECIMAL(10,2) NOT NULL, 	`currency` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`reference` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`refund_amount` DECIMAL(10,2) NOT NULL, 	`refund_reference` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`refund_transaction_no` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`settle_currency` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`status` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`transaction_no` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`success_code` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`success_message` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE, 	INDEX `order_id` (`order_id`) USING BTREE, 	INDEX `payment_id` (`payment_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB ; ";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // SUBSCRIPTIONS
        let sql = "CREATE TABLE `subscriptions` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`customer_id` INT(11) NOT NULL, 	`order_id` INT(11) NOT NULL, 	`product_id` INT(11) NOT NULL, 	`amount` DECIMAL(10,2) NOT NULL, 	`start_date` DATE NOT NULL, 	`subscribe_month` INT(11) NOT NULL, 	`auto_debit_no` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE, 	INDEX `order_id` (`order_id`) USING BTREE, 	INDEX `product_id` (`product_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB ; ";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // SUBSCRIPTION - PAYMENTS
        let sql = "CREATE TABLE `subscribe_payments` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`subscription_id` INT(11) NOT NULL, 	`customer_id` INT(11) NOT NULL, 	`order_id` INT(11) NOT NULL, 	`paid_amount` DECIMAL(10,2) NOT NULL, `auto_debit_no` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`currency` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`reference` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`settle_currency` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`transaction_no` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`status` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`success_code` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`success_message` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE, 	INDEX `order_id` (`order_id`) USING BTREE, 	INDEX `subscription_id` (`subscription_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB ; ";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // CANCEL SUBSCRIPTIONS
        let sql = "CREATE TABLE `cancel_subscriptions` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`customer_id` INT(11) NOT NULL, 	`order_id` INT(11) NOT NULL, 	`vendor` VARCHAR(25) NOT NULL COLLATE 'utf8_general_ci', 	`auto_debit_no` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`auto_reference` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`success_code` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`success_message` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE, 	INDEX `order_id` (`order_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB;";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // TOKENS
        let sql = "CREATE TABLE `tokens` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`recurring_auth_id` INT(11) NOT NULL, 	`customer_id` INT(11) NOT NULL, 	`auto_debit_no` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`auto_reference` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`vendor` VARCHAR(25) NOT NULL COLLATE 'utf8_general_ci', 	`access_token_expiry_time` DATETIME NOT NULL, 	`refresh_token_expiry_time` DATETIME NOT NULL, 	`success_code` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`success_message` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB;";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // RECURRING AUTHORIZATIONS
        let sql = "CREATE TABLE `recurring_authorizations` ( 	`id` INT(11) NOT NULL AUTO_INCREMENT, 	`customer_id` INT(11) NOT NULL, 	`order_id` INT(11) NULL DEFAULT NULL, 	`temp_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`auth_url` TEXT NOT NULL COLLATE 'utf8_general_ci', 	`auto_debit_no` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`auto_reference` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci', 	`vendor` VARCHAR(25) NOT NULL COLLATE 'utf8_general_ci', 	`success_code` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`success_message` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci', 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE, 	INDEX `customer_id` (`customer_id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB ; ";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // CRON-LOGS
        let sql = "CREATE TABLE `cron_logs` ( 	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, 	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci', 	`start_at` DATETIME NULL DEFAULT NULL, 	`end_at` DATETIME NULL DEFAULT NULL, 	`log` TEXT NULL DEFAULT NULL, 	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 	PRIMARY KEY (`id`) USING BTREE ) COLLATE='utf8_general_ci' ENGINE=InnoDB ; ";
        await queryInterface.sequelize.query(sql)
      })
      .then(async () => {

        // ROLES
        let sql = "CREATE TABLE IF NOT EXISTS `roles` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(255) CHARACTER SET utf8 NOT NULL,`status` enum('active','inactive') CHARACTER SET utf8 DEFAULT 'active',`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`), UNIQUE KEY `unique_name` (`name`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
        await queryInterface.sequelize.query(sql)
      })

      .then(async () => {

        // USER-TOKENS
        let sql = "CREATE TABLE IF NOT EXISTS `user_tokens` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`username` varchar(255) NOT NULL,`token` text NOT NULL,`refresh_token` text NOT NULL,`created_at` datetime DEFAULT CURRENT_TIMESTAMP,`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`) USING BTREE) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
        await queryInterface.sequelize.query(sql)
      })

  },

  down: (queryInterface, Sequelize) => {

  }
};
