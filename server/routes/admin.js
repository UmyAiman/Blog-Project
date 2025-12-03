const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * Middleware: Check if logged in
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/admin/login');
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.redirect('/admin/login');
  }
};

/**
 * GET /admin/login
 */
router.get('/login', async (req, res) => {
  try {
    const locals = {
      title: "Admin Login",
      description: "Simple Blog created with Nodejs, express & MongoDB."
    };
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /admin/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /admin/dashboard
 */
/**
 * GET /admin/dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: "Simple Blog created with Nodejs, express & MongoDB."
    };

    // Get the search term from query and remove extra spaces
    const searchQuery = req.query.search ? req.query.search.trim() : '';
    let data;

    if (searchQuery.length > 0) {
      const regex = new RegExp(searchQuery, 'i'); // case-insensitive match
      data = await Post.find({ title: regex }).sort({ createdAt: -1 });
    } else {
      data = await Post.find().sort({ createdAt: -1 });
    }

    res.render('admin/dashboard', {
      locals,
      data,
      search: searchQuery, // send search term to EJS
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});


/**
 * GET /admin/add-post
 */
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: "Simple Blog created with Nodejs, express & MongoDB."
    };

    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /admin/add-post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body
    });

    await newPost.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /admin/edit-post/:id
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Simple Blog created with Nodejs, express & MongoDB."
    };

    const data = await Post.findById(req.params.id);

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }
});

/**
 * PUT /admin/edit-post/:id
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });

    res.redirect(`/admin/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE /admin/delete-post/:id
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /admin/logout
 */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// TEMP: Create admin user quickly
router.get('/create-admin', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const username = "admin";
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = require('../models/User');
    
    const existing = await User.findOne({ username });
    if (existing) return res.send('Admin already exists');

    await User.create({ username, password: hashedPassword });
    res.send('Admin user created successfully');
  } catch (err) {
    console.log(err);
    res.send('Error creating admin');
  }
});

module.exports = router;
