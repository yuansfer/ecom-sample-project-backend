var models = require('./index');

module.exports = (sequelize, DataTypes) => {

	const Cart = sequelize.define('Cart', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		customer_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		shipping_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		shipping_city_state: {
			type: DataTypes.STRING,
			allowNull: true
		},
		shipping_country: {
			type: DataTypes.STRING,
			allowNull: true
		},
		shipping_email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		shipping_phone: {
			type: DataTypes.STRING,
			allowNull: true
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

	Cart.associate = models => {

		Cart.hasMany(models.CartProduct, {
			sourceKey: "id",
			foreignKey: {
				name: 'cart_id',
			},
			as: 'products'
		});

		Cart.belongsTo(models.Customer, {
			foreignKey: "customer_id",
			as: "customer",
		});
	}
	return Cart;
};