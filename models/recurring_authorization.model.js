module.exports = (sequelize, DataTypes) => {

    const RecurringAuthorization = sequelize.define("RecurringAuthorization", {
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
            allowNull: true,
        },
        temp_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        auth_url: {
            type: DataTypes.TEXT,
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
        vendor: {
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

    // RecurringAuthorization.associate = models => {

    //     RecurringAuthorization.hasOne(models.Token, {
    //         sourceKey: "id",
    //         foreignKey: {
    //             name: 'recurring_auth_id',
    //             allowNull: true
    //         },
    //         as: 'auth_token',
    //     });

    // }

    return RecurringAuthorization;
};