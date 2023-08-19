//modules 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//function exports
const connectToMongo = require('./connectToMongo');

connectToMongo()// functiont to connect with MongoDB
const app = express()

// to make json request we will use this middleware
app.use(express.json())

// app.get('/',(req,res)=>{
//     res.send("Hello World!")
// })

//to make a get request from express router inside routes folder
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

//app is listening on port number 3000
app.listen(3000,()=>{
    console.log("example app listening on http://localhost:"+3000);
})