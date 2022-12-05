module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users_shop', {
    userId: DataTypes.STRING,
    itemId: DataTypes.INTEGER,
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      'default': 0,
    },
  }, {
    timestamps: false,
  });
};