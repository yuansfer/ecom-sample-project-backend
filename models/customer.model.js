module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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

    return Customer;
};