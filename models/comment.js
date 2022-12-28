"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Comment.belongsTo(models.Post, { foreignKey: "post_id" });
      models.Comment.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Comment.init(
    {
      commentId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
