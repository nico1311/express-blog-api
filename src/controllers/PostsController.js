const Joi = require('joi');
const Post = require('../db/models/Post'),
  Category = require('../db/models/Category');

/**
 * @swagger
 * components:
 *  responses:
 *    UnprocessableEntity:
 *      description: 'Body validation failed'
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              errors:
 *                type: array
 *                description: 'Array of failed validation rules'
 *                items:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: The error message
 *                      example: '"title" is not allowed to be empty'
 *                    path:
 *                      type: array
 *                      description: 'Path of the field that failed the validation'
 *                      items:
 *                        type: string
 *                    type:
 *                      type: string
 *                      description: 'Error type'
 *                      example: 'string.empty'
 *                    context:
 *                      type: object
 *                      description: 'The values that were tested against the validator'
 *                      properties:
 *                        label:
 *                          type: string
 *                          description: 'Field label'
 *                          example: 'title'
 *                        value:
 *                          type: string
 *                          description: 'The value that was passed to the validator'
 *                          example: ''
 *                        key:
 *                          type: string
 *                          description: 'Field name'
 *                          example: 'title'
 */

/**
 * Create a post
 * @swagger
 * /api/posts:
 *  post:
 *    tags:
 *      - Posts
 *    summary: Create a post
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      '201':
 *        description: 'Post created successfully'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      '422':
 *        $ref: '#/components/responses/UnprocessableEntity'
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 */
const createPost = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().max(255).required(),
    content: Joi.string().required(),
    imageUrl: Joi.string().max(2048).regex(/(https?:\/\/.*\.(?:png|jpg|gif|webp))/i).required(),
    category: Joi.string().required()
  });

  try {
    let values = await schema.validateAsync(req.body);

    const [category] = await Category.findOrCreate({
      where: {
        name: values.category.trim()
      }
    });

    const post = await Post.create({
      ...values,
      categoryId: category.id
    });

    res.status(201).json({
      ...post.dataValues,
      category
    });
  } catch (err) {
    if (err.details) { // validation error
      res.status(422).json({
        errors: err.details
      });
    } else {
      res.status(500).json({
        error: err.message
      });
    }
  }
}

/**
 * Get all posts
 * @swagger
 * /api/posts:
 *  get:
 *    tags:
 *      - Posts
 *    summary: Get all posts
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              description: 'Array of posts'
 *              items:
 *                $ref: '#/components/schemas/Post'
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 */
const getAllPosts = async (req, res) => {
  try {
    let posts = await Post.findAll({
      attributes: {
        exclude: ['content']
      },
      include: Category,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      posts
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

/**
 * Get a single post
 * @swagger
 * /api/posts/{id}:
 *  get:
 *    tags:
 *      - Posts
 *    summary: Get a single post
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: 'ID of the post to get'
 *    responses:
 *      '200':
 *        description: 'Success'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      '404':
 *        description: 'The requested post cannot be found'
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 */
const getPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (Number.isNaN(postId)) return res.status(404).json({
      error: 'Post not found'
    });

    const post = await Post.findByPk(postId, {
      include: Category
    });

    if (!post) return res.status(404).json({
      error: 'Post not found'
    });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

/**
 * Edit a post
 * @swagger
 * /api/posts/{id}:
 *  patch:
 *    tags:
 *      - Posts
 *    summary: Edit a post
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: 'ID of the post to edit'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      '200':
 *        description: 'Post edited successfully'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      '404':
 *        description: 'The requested post cannot be found'
 *      '422':
 *        $ref: '#/components/responses/UnprocessableEntity'
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 */
const updatePost = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().max(255).optional(),
    content: Joi.string().optional(),
    imageUrl: Joi.string().max(2048).regex(/(https?:\/\/.*\.(?:png|jpg|gif|webp))/i).optional(),
    category: Joi.string().optional()
  });

  try {
    const postId = parseInt(req.params.id, 10);
    if (Number.isNaN(postId)) return res.status(404).json({
      error: 'Post not found'
    });

    const post = await Post.findByPk(postId, {
      include: Category
    });

    if (!post) return res.status(404).json({
      error: 'Post not found'
    });

    let values = await schema.validateAsync(req.body);

    let category;
    if (values.category) {
      [category] = await Category.findOrCreate({
        where: {
          name: values.category.trim()
        }
      });
      post.setCategory(category);
    }

    Object.keys(values).forEach((key) => {
      if (key !== 'category') {
        post[key] = values[key];
      }
    });

    await post.save();

    const responseData = category ? {
      ...post.dataValues,
      category
    } : post;

    res.status(200).json(responseData);
  } catch (err) {
    if (err.details) { // validation error
      res.status(422).json({
        errors: err.details
      });
    } else {
      res.status(500).json({
        error: err.message
      });
    }
  }
}

/**
 * Delete a product
 * @swagger
 * /api/posts/{id}:
 *  delete:
 *    tags:
 *      - Posts
 *    summary: Delete a post
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: 'ID of the post to delete'
 *    responses:
 *      '204':
 *        description: 'Post deleted successfully'
 *      '404':
 *        description: 'The requested post cannot be found'
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 */
const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (Number.isNaN(postId)) return res.status(404).json({
      error: 'Post not found'
    });

    const post = await Post.findByPk(postId, {
      include: Category
    });

    if (!post) return res.status(404).json({
      error: 'Post not found'
    });

    await post.destroy();

    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost
}
