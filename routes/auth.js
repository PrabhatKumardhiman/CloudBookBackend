const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');


dotenv.config()// receving files form .env

// Rout 1 using express router to Create a user on url "localhost:3000/api/auth/createuser" and logged in doesnot require
router.post('/createuser',
    [
        body('name', "name can not be blank").notEmpty(),
        body('email', 'enter a valid email').isEmail(),
        body('password', "password can not be blank").notEmpty()
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


// Route 2 : using express router to Login a user on url "localhost:3000/api/auth/login" and logged in doesnot require
router.post('/login',
    [
        body('email', 'please enter a valid email').isEmail(),
        body('password', 'password cannot be blank').notEmpty()
    ], async (req, res) => {
        const errors = validationResult(req);
        //condition that checks if there are any error. which return the error 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // destructuring email and password from request bosy
            const { email, password } = req.body
            // checking if user exists in the database with the provoded email
            const user = await User.findOne({ email })
            // if user does not exists then->
            if (!user) {
                return res.status(400).send("Wrong Credentails, Please Login Again")
            }
            // if the user exists compare  password provided with the  password hash of user in database
            const comparedPassword = await bcrypt.compare(password, user.password)
            // if password doesnot match
            if (!comparedPassword) {
                return res.status(400).send("Wrong Credentails, Please Login Again")
            }
            // Creating JWT token with user id as the data
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwtToken = jwt.sign(data, process.env.JWT_PVT_KEY)

            // return the jwt token as  response
            res.json({ jwtToken })

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Something went wrong" })
        }
    })

// Rout 3 using express router to get user details on url "localhost:3000/api/auth/getuser" and logged require
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" })
    }
})



module.exports = router