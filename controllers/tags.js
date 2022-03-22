const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Tag = require('../models/Tag');
const Post = require('../models/Post');
const { findByIdAndUpdate } = require('../models/Tag');


//@description get reviews
//@route GET /api/v1/reviews
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//access Public

exports.getTags = asyncHandler(async (req, res, next) => {

    res
        .status(200)
        .json(res.advancedResults);

});


//@description get a single category
//@route GET /api/v1/reviews/:id
//access Public

exports.getTag = asyncHandler(async (req, res, next) => {

   const tag = await Tag.findById(req.params.id).populate({
       path: 'posts',
       select: ['title','categories']
   });

   if (!tag) {
       return next(new ErrorResponse(`No tag found with of ${req.params.id}`,404));
   }

   res.status(200).json({
       success : true,
       data: tag
   })
});

//@description Add categories
//@route POST /api/v1/bootcamp/:bootcampId/reviews
//access Private

exports.createTag = asyncHandler(async (req, res, next) => {

      //Add user to req.body
    req.body.user = req.user.id;

    const tag = await Tag.create(req.body);

    res.status(201).json({
        success : true,
        data: tag
    });
 });


 //@description Update categories
//@route PUT /api/v1/reviews/:id
//access Private

exports.updateTag = asyncHandler(async (req, res, next) => {


    let tag = await Tag.findById(req.params.id);

    if (!tag) {
        return next( new ErrorResponse(`No tag found with the id of ${req.params.id}`,404));
    }


    //make sure categories belong to user or user is an admin
    if (tag.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next( new ErrorResponse(`Not Authorized to update tag`,401));
    }

    tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
 
    res.status(200).json({
        success : true,
        data: tag
    })
 });


//@description Delete categories
//@route DELETE /api/v1/reviews/:id
//access Private

exports.deleteTag = asyncHandler(async (req, res, next) => {


    const tag = await Tag.findById(req.params.id);

    if (!tag) {
        return next( new ErrorResponse(`No tag found with the id of ${req.params.id}`,404));
    }


    //make sure categories belong to user or user is an admin
    if (tag.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next( new ErrorResponse(`No Authorized to delete tag`,401));
    }

    await tag.remove();
 
    res.status(200).json({
        success : true,
        data: {}
    })
 });
 

