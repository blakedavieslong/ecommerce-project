module.exports = (sequelize, DataTypes) => {
    const Carts = sequelize.define('Carts', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        tableName: 'carts',
        timestamps: false
    });

    return Carts;
};