const express = require('express');
const router = express.Router();
const post = require('../model/post');
const user = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const adminLayout = '../views/layout/admin'
require('dotenv').config();

/**
 * GET/
 * admin login
 */

const MYSECRTET = process.env.MySecret;

const SECRET_KEY = process.env.VISUAL_CROSSING_KEY


async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token
    if(!token) {res.status(404).send('token is not provid') }
    
    try {
        const decode= await jwt.verify(token,SECRET_KEY);
        req.userId = decode.userId;
        next()    
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
    
  } catch (error) {
    console.error(error);
        
  }
    
}


router.get('/admin',(req, res)=>{
    try {
        res.render('admin/login', {layout: adminLayout})
    } catch (error) {
        console.error(error);
        
    }
})

/** 
 * POST/
 * admin check login
 */
router.post('/admin-login',async(req, res)=>{
    try {
        const { username , password} = req.body;

        const DBUser = await user.findOne({username: username})
        if (!DBUser) { res.status(404).send('wrong email or password') }
        const isMatch = await bcrypt.compare(password, DBUser.password)
        if (!isMatch) { res.status(404).send('wrong email or password') }
        const count = await post.countDocuments()
        const posts= await post.find();
        const token = jwt.sign({UserId: DBUser._id },SECRET_KEY)
        res.cookie('token',token,{httpOnly: true})

        // res.render('admin/dashborad', {layout: adminLayout,
        //                 posts,
        //                 postCount: count,
            
        //             })

        res.redirect('/dashborad')
    
    } catch (error) {
        console.error(error); 
    }
})


router.get('/dashborad',authMiddleware,async(req, res)=>{
    try {
        const count = await post.countDocuments()
        const posts= await post.find();
        res.render('admin/dashborad', {layout: adminLayout,
            posts,
            postCount: count,

        })
    } catch (error) {
        console.error(error);       
    }
})



/** 
 * GET/
 * add post
 */
router.get('/add-post', (req, res)=>{
    try {
        res.render('admin/addPost')
    } catch (error) {
        console.error(error);
        
    }
} )


/** 
 * POST/
 * add  a new post
 */
router.post('/add-post', async(req, res)=>{
    try {
        const {title , body } = req.body
        await post.create({
            title: title,
            body: body
        })
        res.send(`
            <script>
              alert("Post added successfully!");
              window.location.href = "/dashborad"; // Redirect to home or any other page
            </script>
          `);
    } catch (error) {
        console.error(error);
        
    }
} )



/** 
 * Get/
 * Edit-Post
 */
router.get('/edit-post/:id' , async(req, res)=>{
try {
    const id = req.params.id;
    const DBPost = await post.findById(id)
    res.render('admin/editPost',{layout: adminLayout,
        DBPost
    })
} catch (error) {
    console.error(error);
    
}
})


/** 
 * Post/
 * Edit-Post
 */
router.post('/edit-post/:id' , async(req, res)=>{
    try {
        
        const { title, body} = req.body;
        await post.findByIdAndUpdate(req.params.id,{
            title:title,
            body: body
        })
        res.send(`
            <script>
              alert("Post edited successfully!");
              window.location.href = "/dashborad"; // Redirect to home or any other page
            </script>
          `);
       
    } catch (error) {
        console.error(error);
        
    }
    })

/** 
 * DELETE/
 * Delete Post
 */

router.delete('/delete-post/:id',async(req, res)=>{
    try {
        await post.findByIdAndDelete(req.params.id)
        res.send(`
            <script>
              alert("Post Deleted successfully!");
              window.location.href = "/dashborad"; // Redirect to home or any other page
            </script>
          `);

    } catch (error) {
        console.error(error);
        
    }
})


// async function rigster() {
//     const username= 'Walid'
//     const   password= '123'
//     const hashpass = await bcrypt.hash(password, 10)
//      await user.create({username: username, password: hashpass})
// }

// rigster()
module.exports= router;