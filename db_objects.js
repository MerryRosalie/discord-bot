const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const Shop = require('./models/Shop.js')(sequelize, Sequelize.DataTypes);
const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const UsersShop = require('./models/UsersShop.js')(sequelize, Sequelize.DataTypes);
const Lottery = require('./models/Lottery.js')(sequelize, Sequelize.DataTypes);

UsersShop.belongsTo(Shop, {
  foreignKey: 'itemId',
  as: 'item',
});

Lottery.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user',
});

Reflect.defineProperty(Users.prototype, 'addItem', {
  value: async function addItem(item) {
    const userItem = await UsersShop.findOne({
      where: {
        userId: this.userId,
        itemId: item.itemId,
      },
    });

    if (userItem) {
      userItem.amount += 1;
      return userItem.save();
    }

    return UsersShop.create({
      userId: this.userId,
      itemId: item.itemId,
      amount: 1,
    });
  },
});

Reflect.defineProperty(Users.prototype, 'getItems', {
  value: function getItems() {
    return UsersShop.findAll({
      where: { userId: this.userId },
      include: ['item'],
    });
  },
});

Reflect.defineProperty(Lottery.prototype, 'getUser', {
  value: function getUser() {
    return Lottery.findOne({
      where: { userId: this.userId },
      include: ['user'],
    });
  },
});

module.exports = { Users, Shop, UsersShop, Lottery };