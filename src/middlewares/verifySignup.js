const db = require('../models')
const ROLES = db.ROLES
const User = db.user

checkDuplicateNickOrNick = (req, res, next) => {
    User.findOne({$or:[{email: req.body.email},{nick: req.body.nick}]})
    exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }

        if (user) {
            res.status(400).send('Email or nick  already exists')
        }

        next()
    })
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Role ${req.body.roles[i]} does not exist`
                })

                return
            }
        }
    }
}

const verifySignup = {
    checkDuplicateNickOrNick,
    checkRolesExisted
}

module.exports = verifySignup