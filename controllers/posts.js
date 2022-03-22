const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Post = require('../models/Post');

//@description 
//get all bootcamps
//@route GET /api/v1/posts
//access Public
exports.getPosts = asyncHandler( async (req, res, next) => {
    
    res
        .status(200)
        .json(res.advancedResults);


});
//@description 
//get certain post
//@route GET /api/v1/post/:id
//access Public
exports.getPost =asyncHandler( async (req, res, next) => {
    
    const post =  await Post.findById(req.params.id).populate({
      path: ['categories','tags'],
      select: 'title'
  });;
    if(!post){
      return  next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: post});

});

//@description 
//Create a post
//@route POST /api/v1/posts
//access Private
exports.createPost = asyncHandler( async (req, res, next) => {
    
    //Add user to req.body
    req.body.user = req.user.id;

    const post = await Post.create(req.body);

    res.status(201).json({
        success : true,
        data: post
    });


});


//@description 
//Update posts
//@route PUT /api/v1/posts/:id
//access Private
exports.updatePost = asyncHandler( async (req, res, next) => {

    
    let post = await Post.findById(req.params.id);

    if(!post){
        return  next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));

    }

    //Make sure user is botcamp owner
    if (post.user.toString() != req.user.id && req.user.role != 'admin') {
      return next( new ErrorResponse(`User ${req.params.id} is not authorized to update this post`, 401));
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: post})


});


//@description 
//Delete bootcamps
//@route DELETE /api/v1/bootcamps/:id
//access Private
exports.deletePost = asyncHandler( async(req, res, next) => {
    
    //const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    const post = await Post.findById(req.params.id);
    
    if(!post){
        return  next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    //Make sure user is botcamp owner
    if (post.user.toString() != req.user.id && req.user.role != 'admin') {
      return next( new ErrorResponse(`User ${req.params.id} is not authorized to delete this post`, 401));
    }

    post.remove();

    res.status(200).json({ success: true, data:{}})
    
});

exports.searchPost = asyncHandler(async(req,res,next) => {
    const post = await Post.fuzzy(req.body.title)

    res.status(201).json({
      success : true,
      data: post
  });

})

// @desc      Upload photo for post
// @route     PUT /api/v1/posts/:id/photo
// @access    Private
exports.postPhotoUpload = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
  

    //check if there is a post with such id
    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }
  
    //Make sure user is post owner
    if (post.user.toString() != req.user.id && req.user.role != 'admin') {
      return next( new ErrorResponse(`User ${req.params.id} is not authorized to update this post`, 401));
    }

  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      await Post.findByIdAndUpdate(req.params.id, { photo: file.name });
  
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  });
