const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.js')(sequelize, DataTypes);
db.Product = require('./products.js')(sequelize, Sequelize.DataTypes);
db.Image = require('./images.js')(sequelize, Sequelize.DataTypes);
db.Cart = require('./carts.js')(sequelize, DataTypes);
db.CartItem = require('./cartItems.js')(sequelize, DataTypes);

db.Product.hasMany(db.Image, {as: 'images', foreignKey: 'product_id'});
db.Image.belongsTo(db.Product, {foreignKey: 'product_id'});
db.Cart.hasMany(db.CartItem, { foreignKey: 'cart_id' });
db.CartItem.belongsTo(db.Cart, { foreignKey: 'cart_id' });

module.exports = db;