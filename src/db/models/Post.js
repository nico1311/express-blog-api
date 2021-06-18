const { DataTypes, Model } = require('sequelize');

/**
 * Blog post model
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          readOnly: true
 *          description: '(Auto-generated) ID of post'
 *          example: 2
 *        title:
 *          type: string
 *          description: Post title
 *          required: true
 *          example: 'My first blog post'
 *        content:
 *          type: string
 *          description: 'Post content. Present only in `/posts/{id}` GET'
 *          example: 'Lorem ipsum dolor sit amet'
 *          required: true
 *          nullable: true
 *        imageUrl:
 *          type: string
 *          description: 'Post image URL. Valid URLs are HTTP(S) URLs ending with `.[jpg|png|gif|webp]` extensions.'
 *          example: 'https://domain.ext/images/MyPhoto.png'
 *        category:
 *          type: string
 *          description: 'Post category name (write-only)'
 *          writeOnly: true
 *          example: 'Default category'
 *        createdAt:
 *          type: string
 *          format: date-time
 *          readOnly: true
 *          description: 'Post creation timestamp'
 *          example: '2021-06-18T03:02:39.000Z'
 */
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
