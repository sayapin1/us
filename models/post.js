"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Post.hasMany(models.Comment, { foreignKey: "post_id" });
      models.Post.hasMany(models.likes, { foreignKey: "post_id" });
      models.Post.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Post.init(
    {
      postId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      like_cnt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
