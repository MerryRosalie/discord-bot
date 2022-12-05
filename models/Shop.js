module.exports = (sequelize, DataTypes) => {
  return sequelize.define('shop', {
    itemId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    cost: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};