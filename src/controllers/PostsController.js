const Post = require('../db/models/Post'),
  Category = require('../db/models/Category');

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: Category
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

module.exports = {
  getAllPosts
}
