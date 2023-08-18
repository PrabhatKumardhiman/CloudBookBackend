//modules 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//function exports
const connectToMongo = require('./connectToMongo');

connectToMongo()// functiont to connect with MongoDB
const app = express()


app.use('/api/auth', require('./routes/auth'))
app.use('./api/notes', require('./routes/notes'))

app.listen(3000)