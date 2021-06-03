module.exports = (sequelize, DataTypes) => {

    const SubscribePayment = sequelize.define("SubscribePayment", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subscription_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        customer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        order_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        paid_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        auto_debit_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        settle_currency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transaction_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        success_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        success_message: {
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

    SubscribePayment.associate = models => {

        SubscribePayment.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "customer",
        });

        SubscribePayment.belongsTo(models.Order, {
            foreignKey: "order_id",
            as: "order",
        });

        SubscribePayment.hasOne(models.RecurringAuthorization, {
            sourceKey: "reference",
            foreignKey: {
                name: 'auto_reference',
                allowNull: true
            },
            as: 'recurring_auth',
        });
    }

    return SubscribePayment;
};