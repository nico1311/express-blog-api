const express = require('express'),
  router = express.Router();

const PostsController = require('../controllers/PostsController');

router.get('/posts', PostsController.getAllPosts);

module.exports = router;
