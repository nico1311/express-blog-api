const express = require('express'),
  router = express.Router();

const PostsController = require('../controllers/PostsController');

router.post('/posts', PostsController.createPost);
router.get('/posts', PostsController.getAllPosts);
router.get('/posts/:id', PostsController.getPost);
router.patch('/posts/:id', PostsController.updatePost);
router.delete('/posts/:id', PostsController.deletePost);

module.exports = router;
