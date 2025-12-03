const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * Homepage - list latest posts
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // posts per page
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })  // latest posts first
      .skip(skip)
      .limit(limit);

    const locals = {
      title: "Home",
      description: "Simple Blog created with Nodejs, Express & MongoDB."
    };

    // Determine next page
    const nextPage = skip + limit < totalPosts ? page + 1 : null;

    res.render('index', { data: posts, locals, nextPage });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

/**
 * GET /post/:id
 * Display full post
 */
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    const locals = {
      title: post.title,
      description: post.body.substring(0, 100)
    };

    res.render('post', { data: post, locals });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

/**
 * POST /search
 * Search posts by title or body
 */
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search Results",
      description: "Simple Blog created with Nodejs, Express & MongoDB."
    };

    let searchTerm = req.body.searchTerm?.trim();
    if (!searchTerm) {
      return res.render("search", { data: [], locals });
    }

    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    // Find posts matching title or body
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
      ]
    }).sort({ createdAt: -1 });

    // Map to include a snippet of the body
    const results = data.map(post => {
      const snippetLength = 100;
      const snippet = post.body.length > snippetLength
        ? post.body.substring(0, snippetLength) + "..."
        : post.body;
      return { ...post._doc, snippet };
    });

    res.render("search", { data: results, locals });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
