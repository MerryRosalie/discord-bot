module.exports = (sequelize, DataTypes) => {
  return sequelize.define('lottery', {
    userId: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
  });
};