module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    previousWorkTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    previousRpsTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });
};