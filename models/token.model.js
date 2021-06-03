module.exports = (sequelize, DataTypes) => {

    const Token = sequelize.define("Token", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        recurring_auth_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        customer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
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
        access_token_expiry_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        refresh_token_expiry_time: {
            type: DataTypes.DATE,
            allowNull: false,
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

    Token.associate = models => {

        Token.belongsTo(models.RecurringAuthorization, {
            targetKey: "id",
            as: 'token',
            foreignKey: {
                name: 'recurring_auth_id',
            }
        });
    }

    return Token;
};