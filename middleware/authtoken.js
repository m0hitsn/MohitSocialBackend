var jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;
const AuthToken = (req, res, next) => {
    try {
        let token = req.cookies.jwt;
        if (token) {
            token = token.split(" ")[1];
            const user = jwt.verify(token, privateKey);
            req.user = user;
        } else {
            res.status(401).json("Invalid Token");
        }
        next();
    } catch {
        res.status(401).json("Unauthorized token");
    }

}

module.exports = AuthToken;