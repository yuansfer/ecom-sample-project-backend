module.exports = (sequelize, DataTypes) => {

    const OrderProduct = sequelize.define("OrderProduct", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
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
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
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

    OrderProduct.associate = models => {

        OrderProduct.belongsTo(models.Product, {
            targetKey: "id",
            as: 'product',
            foreignKey: {
                name: 'product_id',
            }
        });
    }

    return OrderProduct;
};