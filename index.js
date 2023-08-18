const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectToMongo = require('./connectToMongo');

connectToMongo()// functiont to connect to MongoDB
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)