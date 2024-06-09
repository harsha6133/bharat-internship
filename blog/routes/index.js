const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Home Route
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts });
  } catch (err) {
    res.status(500).send(err);
  }
});

// New Post Route
router.get('/new', (req, res) => {
  res.render('new-post');
});

// Create Post Route
router.post('/new', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  try {
    await newPost.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err);
  }
});

// View Post Route
router.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    res.render('post', { post });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Edit Post Route
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    res.render('edit-post', { post });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update Post Route
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    await Post.findByIdAndUpdate(id, { title, content });
    res.redirect(`/post/${id}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
