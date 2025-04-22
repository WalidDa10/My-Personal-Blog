const express = require('express');
const router = express.Router();
const post = require('../model/post');


// async function creat() {
//     const param= {
//         title:"Understanding Node Package Manager",
//         body:"npm (Node Package Manager) is the default package manager for Node.js. It is a command-line tool that allows developers to install, manage, and share JavaScript libraries and tools (called packages) for use in Node.js projects. npm is also the world's largest software registry, hosting millions of open-source packages  ",
//         excerpt:"npm"
//     }
//      NewPost = await post.create(param);
    
// }
// creat();


router.get('/home',async(req, res) => {
    try {
        const searchR = false
        let perPage = 6;
        let page = req.query.page || 1;
        const posts = await post.find().sort({createdAt:-1})
        .skip(perPage * page - perPage)
        .limit(perPage);

        const count = await post.countDocuments()
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        res.render('index', { 
            posts,
            nextPage: hasNextPage ? nextPage : null,
            searchR
        });   
    } catch (error) {
        console.error(error);
        
    }
    
});

router.get('/post/:id',async(req, res) => {
    try {
        const id = req.params.id;
        const PostByIDd = await post.findById(id);  
        res.render('post', { 
            PostByIDd
        });
        
    } catch (error) {
        console.error(error);
        
    }
    
});


router.get('/search', async (req, res) => {
    try {
        const searchR = true; 
        let page = req.query.page || 1; 
        const searchTerm = req.query.searchTerm;
        const posts = await post.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { body: { $regex: searchTerm, $options: 'i' } }
            ]
        })
        res.render('index', { 
            posts ,
            nextPage: null,
            searchR
        });
    } catch (error) {
        console.error(error); 
    }
})




router.get('/about', (req, res) => {
    res.render('about');
});

module.exports= router;