module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users_shop', {
    userId: DataTypes.STRING,
    itemId: DataTypes.BIGINT,
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      'default': 0,
    },
  }, {
    timestamps: false,
  });
};