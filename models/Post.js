const mongoose = require('mongoose');
const slugify = require('slugify');
const fuzzy = require('mongoose-fuzzy-search') ;

const PostSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, 'Please Add A Title'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title can not be more than 50 characters']
      },
      slug: String,
      body: {
        type: String,
        required: [true, 'Please add a description']
      },
      user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true
      },
      categories: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: true
      }],
      tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }]
    },{
      toJSON: { virtuals: true },
      toObject: {virtuals: true }
    });

    //Create bootcamp slug from the name
    PostSchema.pre('save', function(next){
      this.slug = slugify(this.title,{ lower: true});
      next();
    })

    // add the plugin to the model and specify new fields on your schema to hold the trigrams projected 
PostSchema.plugin(fuzzy, {
  fields:{
      title_tg: 'title', // equivalent to (doc) => doc.get('lastname')
  }
})

    module.exports = mongoose.model('Post', PostSchema);