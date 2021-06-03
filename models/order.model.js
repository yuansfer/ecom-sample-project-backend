var models = require('./index');

module.exports = (sequelize, DataTypes) => {

    const Order = sequelize.define('Order', {
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
        // transaction_id: {
        //     type: DataTypes.INTEGER(11),
        //     allowNull: true,
        // },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city_state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
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

    Order.associate = models => {

        Order.hasMany(models.OrderProduct, {
            sourceKey: "id",
            foreignKey: {
                name: 'order_id',
            },
            as: 'products'
        });

        Order.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "customer",
        });

        Order.hasOne(models.Payment, {
            sourceKey: "id",
            foreignKey: {
                name: 'order_id',
                allowNull: true
            },
            as: 'payment',
        });

        Order.hasOne(models.Refund, {
            sourceKey: "id",
            foreignKey: {
                name: 'order_id',
                allowNull: true
            },
            as: 'refund',
        });

        Order.hasOne(models.SubscribePayment, {
            sourceKey: "id",
            foreignKey: {
                name: 'order_id',
                allowNull: true
            },
            as: 'subscribe_payment',
        });

        Order.hasOne(models.Subscription, {
            sourceKey: "id",
            foreignKey: {
                name: 'order_id',
                allowNull: true
            },
            as: 'order_subscription',
        });

        Order.hasOne(models.RecurringAuthorization, {
            sourceKey: "id",
            foreignKey: {
                name: 'order_id',
                allowNull: true
            },
            as: 'recurring_auth',
        });

        Order.hasOne(models.CancelSubscription, {
            sourceKey: "id",
            foreignKey: {
                name: 'order_id',
                allowNull: true
            },
            as: 'cancel_subscription',
        });

    }
    return Order;
};