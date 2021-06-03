module.exports = (sequelize, DataTypes) => {

    const Payment = sequelize.define("Payment", {
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
        vendor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paid_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        settle_currency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transaction_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cashier_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        success_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        success_message: {
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

    Payment.associate = models => {

        Payment.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "customer",
        });

        Payment.belongsTo(models.Order, {
            foreignKey: "order_id",
            as: "order",
        });

        Payment.hasMany(models.Refund, {
            sourceKey: "id",
            foreignKey: {
                name: 'payment_id',
                allowNull: true
            },
            as: 'refunds'
        });

    }

    return Payment;
};