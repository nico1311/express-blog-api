const Joi = require('joi');
const Post = require('../db/models/Post'),
  Category = require('../db/models/Category');

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
