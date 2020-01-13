const jwt = require("jsonwebtoken");

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    // browsers behavior: For certain http words (basically anything but GET)
    // The browser automatically send a OPTIONS request before it sends the actuall request
    // To find out if the server support this to be sent request (but this OPTIONS request doesn't have our header with our token so we have to net it so we don't get an error)
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN' 
        if(!token) {
            throw new Error('Authentication failed!')
        }

        // verify return an object with what we encode in it. Here userId and email
        const decodedToken = jwt.verify(token, 'supersecret_dont_share'); 
        // so we can add a property to our req so the every next req will have it
        req.userData = {
            userId: decodedToken.userId
        }

        next();

    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }


}