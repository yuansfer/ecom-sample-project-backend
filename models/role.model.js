module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Role name is missing"
                },
                notNull: {
                    msg: "Role name should not null"
                }
            },
            unique: {
                name: "unique_name",
                args: [['name']],
                msg: 'Role name already exists'
            },
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: true,
            defaultValue: 'active',
            validate: {
                isIn: {
                    args: [['active', 'inactive']],
                    msg: "Status must be 'active' or 'inactive'"
                }
            }
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

    return Role;
};