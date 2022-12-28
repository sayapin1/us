"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.likes.belongsTo(models.User, { foreignKey: "user_id" });
      models.likes.belongsTo(models.Post, { foreignKey: "post_id" });
    }
  }
  likes.init(
    {
      likesId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_Id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "likes",
    }
  );
  return likes;
};
