//  A MiddleWare Function  - it will run and manupulate the req (body)
const jwt = require('jsonwebtoken');


const fetchuser = async (req, res, next) => {
    try {
        // Get the user from jwtToken and add user id to request body

        // receving auth token from request header
        const authToken = req.header("authtoken")
        // if there isno auth token in header
        if (!authToken) {
            res.status(401).send("Invalid User")
        }
        try {
            // extracting user from authToken
            const userFromJwtToken = await jwt.verify(authToken, process.env.JWT_PVT_KEY)
            // sending user with request
            req.user = userFromJwtToken.user
            //  calling the next callback function
            next();
        } catch (error) {
            res.status(401).send("Invalid User")
        }
        
    } catch (error) {
        console.error({ error: error.message })
    }
}

module.exports = fetchuser;
