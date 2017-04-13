const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const morgan= require('morgan');

// connect to the database and load models
require('./server/models').connect(config.dbUri);

const app = express();
// tell the app to look for static files in these directories

// log requests to the console
app.use(morgan('dev'));



app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);


// start the server
app.listen(3005, () => {
  console.log('Server is running on http://localhost:3005 or http://127.0.0.1:3005');
});