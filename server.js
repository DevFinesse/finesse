const path =require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors =  require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss-clean');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//load env vars
dotenv.config({ path: './config/config.env'});

//connect to database
connectDB();

//Route files
const posts = require('./routes/posts')
const auth = require('./routes/auth')
const users = require('./routes/users')
const categories = require('./routes/categories')
const tags = require('./routes/tag')

const app = express();

//Body Parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());


//dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// File Uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent cross-site scripting attacks
app.use(xss());

//rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 *1000, //10 mins
    max: 100
});
app.use(limiter);

// prevent http param pollution
app.use(hpp());

//enable cors
app.use(cors());



//set static folder
app.use(express.static(path.join(__dirname, 'public')));


//mount router
app.use('/api/v1/posts', posts);
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/categories', categories)
app.use('/api/v1/tags', tags)

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
    );

//handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server and exit process
    server.close(() => process.exit());
});