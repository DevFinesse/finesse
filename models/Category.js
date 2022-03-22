const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please add a category'],
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
    CategorySchema.virtual('posts',{
      ref: 'Post',
      localField: '_id',
      foreignField: 'categories',
      justOne: false

    });

    //cascade delete courses when a category is deleted
    CategorySchema.pre('remove', async function (next) {
        console.log(`Categories being removed from post ${this._id}`);
        await this.model('Category').deleteMany({ post: this._id });
        next();
      });
  
module.exports = mongoose.model('Category', CategorySchema);