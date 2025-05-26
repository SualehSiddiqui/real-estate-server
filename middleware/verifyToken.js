import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
            console.log('token verified')
            next()
        } else {
            return res.status(401).send(err)
        }
    })
}

export default verifyToken;