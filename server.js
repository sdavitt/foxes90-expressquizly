const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./src/db');
const { authenticate } = require('./src/middleware/auth');
const { userData } = require('./src/middleware/userData');
// cookieParser to help maintain auth persistence
const cookieParser = require('cookie-parser');
// GraphQL express communication stuff
const { graphqlHTTP } = require('express-graphql');
// our GraphQL Schema
const schema = require('./src/graphql/schema');

// use the dotenv module to grab my .env vars and load them into the process.env object
dotenv.config()

// create the instance of our express app
const app = express();

// connect to our MongoDB
connectDB();

// graphQL middleware
app.use('/graphql', graphqlHTTP({schema, graphiql: true}));

// express urlencoding extension
app.use(express.urlencoded({ extended: true }));

// cookieParser middleware
app.use(cookieParser());

// auth middleware
app.use(authenticate);

// userData middleware
app.use(userData);

// set up templating engine + views
app.set('view engine', 'ejs');
// show app location of views
app.set('views', path.join(__dirname, '/src/templates/views'));

// initialize our routes
require('./src/routes')(app);

// tell our express app where to run
app.listen(process.env.PORT, ()=>{
    console.log(`Quizly is running on PORT ${process.env.PORT}!`);
});