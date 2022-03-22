const express = require('express');

const { getTags, getTag, createTag, updateTag, deleteTag } = require('../controllers/tags');
    
const Tag = require('../models/Tag');
const router = express.Router({ mergeParams: true });


const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
//const { route } = require('./courses');


router.route('/')
    .get(advancedResults(Tag, 'posts'),getTags)
    .post(protect,authorize('publisher', 'admin'), createTag);

router.route('/:id')
    .get(getTag)
    .put(protect, authorize('publisher', 'admin'), updateTag)
    .delete(protect, authorize('publisher', 'admin'), deleteTag);

module.exports = router;