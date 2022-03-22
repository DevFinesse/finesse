const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env'});

//load models
const Post = require('./models/Post');
const User = require('./models/User');
const Category = require('./models/Category');
const Tag = require('./models/Tag');

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//read json files
const posts = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/posts.json`,'utf-8')
);


const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8')
);

const categories = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/categories.json`,'utf-8')
);

const tags = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/tags.json`,'utf-8')
);

//import into db
const importData = async () => {
    try {
        await Post.create(posts);
        await User.create(users);
        await Category.create(categories);
        await Tag.create(tags);
        
        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

//Delete data

const deleteData = async () => {
    try {
        await Post.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        await Tag.deleteMany();

        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}
