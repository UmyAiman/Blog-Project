const express=require('express');
const router=express.Router();
const Post=require('../models/Post');
/**
 * GET /
 * HOME
*/
//routes

router.get('',async (req,res)=>{

try {
    const locals={
    title:"Nodejs Blogs",
    description:"Simple Blog created with Nodejs, express&MongoDb."
}
   
let perPage=10;
let page=req.query.page ||1;
 const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();
     // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
 res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    
    });

    
} catch (error) {
    console.log(error);
}


});



// router.get('',async (req,res)=>{
// const locals={
//     title:"Nodejs Blogs",
//     description:"Simple Blog created with Nodejs, express&MongoDb."
// }
// try {
//     const data=await Post.find();
//     res.render('index',{locals,data});
// } catch (error) {
//     console.log(error);
// }


// });

/**
 * GET /
 * Post id
*/
router.get('/post/:id',async (req,res)=>{

try {
let slug=req.params.id;
    const data=await Post.findById({_id:slug});
const locals={
    title:data.title,
    description:"Simple Blog created with Nodejs, express&MongoDb.",
      currentRoute: `/post/${slug}`
}
    res.render('post',{locals,data});
} catch (error) {
    console.log(error);
}


});
/**
 * Post/
 * Post searchterm
*/
router.post('/search',async (req,res)=>{

try {
const locals={
    title:"Search",
    description:"Simple Blog created with Nodejs, express&MongoDb."
}
let searchTerm=req.body.searchTerm;
 const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals
    
    });

    
} catch (error) {
    console.log(error);
}


});




router.get('/about',(req,res)=>{
res.render('about',{
  currentRoute: '/about'
}
);
});

function insertPostData(){
    Post.insertMany([
        {
            title:"Building a blog",
            body:"This is a body text"
        },
{
      title: "Building APIs with Node.js",
      body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
    },
    {
      title: "Deployment of Node.js applications",
      body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
    },
    {
      title: "Authentication and Authorization in Node.js",
      body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
    },
{
      title: "Discover how to use Express.js",
      body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
    },
    {
      title: "Learn Morgan - HTTP Request logger for NodeJs",
      body: "Learn Morgan."
    },
    ])
}
insertPostData();
module.exports=router;