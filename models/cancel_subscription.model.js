module.exports = (sequelize, DataTypes) => {

    const CancelSubscription = sequelize.define("CancelSubscription", {
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
            allowNull: false
        },
        auto_debit_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        auto_reference: {
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

    return CancelSubscription;
};