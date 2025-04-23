const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors')
const connectDB = require("./config/db");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
// const speciesRouter = require('./routes/species');

const app = express();

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/species', speciesRouter);

module.exports = app;
