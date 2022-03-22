const express = require('express');

const { getPosts,
        getPost,
        createPost,
        updatePost,
        deletePost,
        searchPost,
        postPhotoUpload} = require('../controllers/posts');

const Post = require('../models/Post');

// Include other resource routers
const categoryRouter = require('./categories'); 
    
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:postId/categories', categoryRouter);


router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), postPhotoUpload);

router.route('/')
    .get(searchPost)
    .get(advancedResults(Post, 'categories'),getPosts)
    .post(protect,authorize('publisher', 'admin'), createPost);


router.route('/:id')
    .get(getPost)
    .put(protect,authorize('publisher', 'admin'), updatePost)
    .delete(protect,authorize('publisher', 'admin'), deletePost);

module.exports = router;