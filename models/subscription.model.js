module.exports = (sequelize, DataTypes) => {

    const Subscription = sequelize.define("Subscription", {
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
        order_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        subscribe_month: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        auto_debit_no: {
            type: DataTypes.STRING,
            allowNull: false
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

    Subscription.associate = models => {

        Subscription.belongsTo(models.Order, {
            foreignKey: "order_id",
            as: "order",
        });

        Subscription.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "customer",
        });

        Subscription.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });

        Subscription.hasMany(models.SubscribePayment, {
            sourceKey: "id",
            foreignKey: {
                name: 'subscription_id',
            },
            as: 'subscription_payments'
        });
    }
    return Subscription;
};