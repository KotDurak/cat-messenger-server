const jwt = require('jsonwebtoken')
const config = require('../../config/auth')
const db = require('../models')

const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']

    if (!token) {
        res.status(403).send({message: 'No token provided'})
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: 'Unauthorized'})
        }

        req.userId = decoded.id
        next()
    })
}

isAdmin = (req, res, next) => {
    User.findById(req.userId)
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: 'Internal error'})
                return
            }

            Role.find({_id: {$in: user.roles}}, (err, roles) => {
                if (err) {
                    res.status(500).send({message: 'Internal error'})
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        next()
                        return;
                    }
                }

                res.status(403).send({message: 'User is not admin'})
            })
        })
}

const authJwt = {
    verifyToken,
    isAdmin
}

module.exports = authJwt