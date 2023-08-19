const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');


dotenv.config()// receving files form .env

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
        try {
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            // Creating JWT token with user id as the data
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwtToken = jwt.sign(data, process.env.JWT_PVT_KEY)

            // return the jwt token as  response
            res.json({ jwtToken })
            // cathing the error if email is same as we have index  on email
        }
        // catching duplicate email 
        catch (error) {
            if (error.code === 11000) {
                res.status(400).json({ error: "User with this email Already exists" })
            }
            res.status(500).json({ error: error.message })
        }
        //catching any other error
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" })
    }
})


module.exports = router