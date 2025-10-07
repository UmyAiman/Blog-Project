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
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

/**
 * GET /admin
 * Admin login page
 */
router.get('/admin', async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with Nodejs, express & MongoDB."
    };
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /admin
 * Admin login (checks MongoDB user)
 */
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error' });
  }
});

/**
 * GET /dashboard
 * Admin Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals={
        title:'Dashboard',
   description: "Simple Blog created with Nodejs, express & MongoDB."
    }
    const data=await Post.find();
    res.render('admin/dashboard', {
        locals,
        data,
         layout: adminLayout
    
});
} catch (error) {
    console.log(error);
  }
  
  });
  /**
 * GET /dashboard
 * Admin Create new post
 */
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals={
        title:'Add Post',
   description: "Simple Blog created with Nodejs, express & MongoDB."
    }
    const data=await Post.find();
    res.render('admin/add-post', {
        locals,
        
    
});
} catch (error) {
    console.log(error);
  }
  
  });
     /**
 * Get
 * Admin Create new post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Simple Blog created with Nodejs, express & MongoDB."
    };
const data=await Post.findOne({_id:req.params.id});
res.render('admin/edit-post',{
    data,
    locals,
    layout:adminLayout
})
 
} catch (error) {
    console.log(error);
  }
  
  });
   /**
 * PUT
 * Admin Create new post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
   
await Post.findByIdAndUpdate(req.params.id,{
      title: req.body.title,
       body:req.body.body,
       updatedAt:Date.now()
});
res.redirect(`/edit-post/${req.params.id}`);
 
} catch (error) {
    console.log(error);
  }
  
  });

 /**
 * Post
 * Admin Create new post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    

  try {
    const newPost=new Post({
       title: req.body.title,
       body:req.body.body
    });
    await Post.create(newPost);
    res.redirect('/dashboard');
  } catch (error) {
     console.log(error);
  }

} catch (error) {
    console.log(error);
  }
  
  });

/**
 * POST /register
 * Admin Register (creates a user in MongoDB)
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await User.create({
        username,
        password: hashedPassword
      });

      res.status(201).json({ message: 'User Created', user: newUser });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'Username already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

  /**
 *Delete
 *  delete admin post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
try {
    await Post.deleteOne({_id:req.params.id});
    res.redirect('/dashboard');
} catch (error) {
    console.log(error);
}
});
/**
 *Get
 *  admin logout
 */
router.get('/logout',(req,res)=>{
  res.clearCookie('token');
 // res.json({message:'Logout successfully.'});
  res.redirect('/');
})



module.exports = router;
