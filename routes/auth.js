const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// using express router to Create a user on url "localhost:3000/api/auth/" and logged in doesnot require
router.get('/', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    //condition that checks if there are any error. which return the error 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
// creating the user in dataBase
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user => res.json(user))
    .catch(error  => {if (error.code === 11000) {
        res.send("User Already exists")}
    })
})


module.exports = router