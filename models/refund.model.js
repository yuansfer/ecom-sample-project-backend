module.exports = (sequelize, DataTypes) => {

    const Refund = sequelize.define("Refund", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        payment_id: {
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
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refund_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        refund_reference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refund_transaction_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        settle_currency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transaction_no: {
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

    Refund.associate = models => {

        Refund.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "customer",
        });

        Refund.belongsTo(models.Order, {
            foreignKey: "order_id",
            as: "order",
        });
    }

    return Refund;
};