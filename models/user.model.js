module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        customer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null,
        },
        role_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null,
        },
        user_type: {
            type: DataTypes.ENUM('customer', 'merchant'),
            allowNull: true
        }, 
        firstname: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "First Name is missing"
                },
                notNull: {
                    msg: "First Name should not null"
                }
            }
        },
        lastname: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: {
                name: "username",
                args: [['username']],
                msg: 'Username already exists'
            }
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Email should not empty"
                },
                notNull: {
                    msg: "Email should not null"
                },
                isEmail: {
                    msg: "Please enter your email address in format: (yourname@example.com)"
                }
            },
            unique: {
                name: "email",
                args: [['email']],
                msg: 'Email already exists'
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
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
    }, {
        underscored: true,
        indexes: [{
            name: 'username',
            fields: [sequelize.fn('lower', sequelize.col('username'))],
            unique: true,
        }, {
            name: 'email',
            fields: [sequelize.fn('lower', sequelize.col('email'))],
            unique: true,
        }],
    });

    User.associate = models => {
        User.belongsTo(models.Role, {
            sourceKey: "id",
            as: 'role',
            foreignKey: {
                name: 'role_id',
                allowNull: true
            }
        });
    }

    return User;
};