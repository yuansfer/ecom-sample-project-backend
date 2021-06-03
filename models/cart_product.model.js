module.exports = (sequelize, DataTypes) => {

    const CartProduct = sequelize.define("CartProduct", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        cart_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        qty: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        size: {
            type: DataTypes.ENUM('small', 'medium', 'large'),
            allowNull: true
        },
        purchase_mode: {
            type: DataTypes.ENUM('buy', 'subscribe'),
            allowNull: 'buy'
        },
        subscribe_month: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
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

    CartProduct.associate = models => {

        CartProduct.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });

        CartProduct.belongsTo(models.Cart, {
            foreignKey: 'cart_id'
        });

    }

    return CartProduct;
};