const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// using express router to Create a user on url "localhost:3000/api/auth/" and logged in doesnot require
router.post('/createuser', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    //condition that checks if there are any error. which return the error 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //securing password  by adding hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // creating the user in dataBase
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }).then(user => res.json(user))
            // cathing the error if email is same as we have index  on email
            .catch(error => {
                if (error.code === 11000) {
                    res.status(400).json({ error: "User with this email Already exists" })
                }
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" })
    }
})


module.exports = router