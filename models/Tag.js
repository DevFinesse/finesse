const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please add a tag'],
        maxlength: [50, 'Title can not be more than 50 characters']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
},{
  toJSON: { virtuals: true },
  toObject: {virtuals: true }
});

    //Reverse populate with virtuals
    TagSchema.virtual('posts',{
      ref: 'Post',
      localField: '_id',
      foreignField: 'tags',
      justOne: false

    });

    //cascade delete courses when a category is deleted
    TagSchema.pre('remove', async function (next) {
        console.log(`tags being removed from post ${this._id}`);
        await this.model('Tag').deleteMany({ post: this._id });
        next();
      });
  
module.exports = mongoose.model('Tag', TagSchema);