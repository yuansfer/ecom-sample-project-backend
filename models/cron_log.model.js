module.exports = (sequelize, DataTypes) => {
    const CronLog = sequelize.define('CronLog', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        start_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        end_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        log: {
            type: DataTypes.JSON,
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
        }
    }, {
        timestamps: true,
        underscored: true
    }
    );

    return CronLog;
};