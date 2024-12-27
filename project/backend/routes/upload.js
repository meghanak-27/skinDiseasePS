const express = require('express');
const {upload,uploadImage} = require('../controllers/upload');
const router = express.Router();
const axios = require('axios');


// router.get('/',(req,res)=>{
//     return res.render('upload',{prediction:null})
// })

// Your NewsAPI key
const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get('/', async (req, res) => {
    const userId = req.cookies.userId; // Check the cookie here
    
    if (!userId) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    
    
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=skin+disease&apiKey=${NEWS_API_KEY}`);
        const articles = response.data.articles;

        res.render('upload', { prediction: null, articles: articles }); // Pass articles to the EJS file
    } catch (error) {
        console.error('Error fetching news:', error);
        res.render('upload', { prediction: null, articles: [] }); // Pass an empty array in case of an error
    }
});



// Single file upload route, using multer as middleware
router.post('/', upload.single('image'), uploadImage);

module.exports = router;
