const jwt = require('jsonwebtoken');
require("dotenv").config();

const fetchuser = (req, res, next) =>{
    const token = req.header('auth-token');
    try {
        if(!token)
        {
            res.status(401).json({error: "Not Authorized To Perform This!"})
        }
        else
        {
            const data = jwt.verify(token, process.env.JWT_SECRET); // this will return the data in the token that you inserted
            req.user = data.user;
            next();
        }

    } catch (error) {
        res.status(401).json({error: "Please authenticate using a valid token"})
        }

}

module.exports = fetchuser;