const express = require('express');

const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categories');
    
const Category = require('../models/Category');
const router = express.Router({ mergeParams: true });


const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
//const { route } = require('./courses');


router.route('/')
    .get(advancedResults(Category, 'posts'),getCategories)
    .post(protect,authorize('publisher', 'admin'), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, authorize('publisher', 'admin'), updateCategory)
    .delete(protect, authorize('publisher', 'admin'), deleteCategory);

module.exports = router;