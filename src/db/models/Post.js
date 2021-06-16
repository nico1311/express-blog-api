const { DataTypes, Model } = require('sequelize');

class Post extends Model {
  /**
   * Initialize this model on a Sequelize instance.
   * @param {import('sequelize').Sequelize} sequelize
   */
  static init(sequelize) {
    return super.init({
      title: {
        type: DataTypes.STRING
      },
      content: {
        type: DataTypes.TEXT
      },
      imageUrl: {
        type: DataTypes.STRING(2048)
      }
    }, {
      modelName: 'post',
      timestamps: true,
      updatedAt: false,
      sequelize
    });
  }
}

module.exports = Post;
