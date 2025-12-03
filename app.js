require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));

app.use(express.static('public'));

// Global variables for EJS
app.locals.isActiveRoute = isActiveRoute;
app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});

// View engine setup
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/main'));          // Main website
app.use('/admin', require('./server/routes/admin'));   // Admin panel

// Start server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
