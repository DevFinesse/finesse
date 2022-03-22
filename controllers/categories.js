const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');
const Post = require('../models/Post');
const { findByIdAndUpdate } = require('../models/Category');


//@description get reviews
//@route GET /api/v1/reviews
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//access Public

exports.getCategories = asyncHandler(async (req, res, next) => {

    res
        .status(200)
        .json(res.advancedResults);

});


//@description get a single category
//@route GET /api/v1/reviews/:id
//access Public

exports.getCategory = asyncHandler(async (req, res, next) => {

   const categories = await Category.findById(req.params.id).populate({
       path: 'posts',
       select: 'title'
   });

   if (!categories) {
       return next(new ErrorResponse(`No category found with of ${req.params.id}`,404));
   }

   res.status(200).json({
       success : true,
       data: categories
   })
});

//@description Add categories
//@route POST /api/v1/bootcamp/:bootcampId/reviews
//access Private

exports.createCategory = asyncHandler(async (req, res, next) => {

      //Add user to req.body
    req.body.user = req.user.id;

    const category = await Category.create(req.body);

    res.status(201).json({
        success : true,
        data: category
    });
 });


 //@description Update categories
//@route PUT /api/v1/reviews/:id
//access Private

exports.updateCategory = asyncHandler(async (req, res, next) => {


    let categories = await Category.findById(req.params.id);

    if (!categories) {
        return next( new ErrorResponse(`No Category found with the id of ${req.params.id}`,404));
    }


    //make sure categories belong to user or user is an admin
    if (categories.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next( new ErrorResponse(`No Authorized to update categories`,401));
    }

    categories = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
 
    res.status(200).json({
        success : true,
        data: categories
    })
 });


//@description Delete categories
//@route DELETE /api/v1/reviews/:id
//access Private

exports.deleteCategory = asyncHandler(async (req, res, next) => {


    const categories = await Category.findById(req.params.id);

    if (!categories) {
        return next( new ErrorResponse(`No Category found with the id of ${req.params.id}`,404));
    }


    //make sure categories belong to user or user is an admin
    if (categories.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next( new ErrorResponse(`No Authorized to delete categories`,401));
    }

    await categories.remove();
 
    res.status(200).json({
        success : true,
        data: {}
    })
 });
 

