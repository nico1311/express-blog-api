const { DataTypes, Model } = require('sequelize');

class Category extends Model {
  /**
   * Initialize this model on a Sequelize instance.
   * @param {import('sequelize').Sequelize} sequelize
   */
  static init(sequelize) {
    return super.init({
      name: {
        type: DataTypes.STRING
      },
    }, {
      modelName: 'category',
      timestamps: false,
      sequelize
    });
  }
}

module.exports = Category;
