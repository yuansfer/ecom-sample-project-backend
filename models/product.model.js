module.exports = (sequelize, DataTypes) => {

	const Product = sequelize.define("Product", {
		id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		price: {
            type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
        },
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		published: {
			type: DataTypes.ENUM('yes', 'no'),
            defaultValue: 'yes',
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'updated_at'
		},
	}, {
		underscored: true
	});

	Product.associate = models => {

		Product.belongsToMany(models.Cart, {
			through: 'cart_products',
			as: 'carts',
			foreignKey: 'product_id',
			otherKey: 'cart_id'
		});
	};

	return Product;
};